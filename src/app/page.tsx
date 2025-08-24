'use client';
import { useState, useEffect } from 'react';
import styles from './homepage.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { uploadToImageKit } from '@/lib/imagekit/client';

// Types
type Post = {
  id: string;
  content: string;
  author_id: string;
  media_url?: string;
  created_at: string;
  profiles: { username: string; full_name: string; avatar_url: string; } | null;
};

// Main Component
export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<Post | null>(null); // State for the post being edited
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedPostForShare, setSelectedPostForShare] = useState<Post | null>(null);
  const supabase = createClient();

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('posts').select(`*, profiles (*)`).order('created_at', { ascending: false }).limit(20);
    if (error) toast.error("Could not load the newsfeed.");
    else setPosts(data as Post[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleShareClick = (post: Post) => {
      setSelectedPostForShare(post);
      setShowShareModal(true);
  };

  return (
    <>
      <div className={styles.backgroundShapes}><div className={`${styles.shape} ${styles.shape1}`}></div><div className={`${styles.shape} ${styles.shape2}`}></div></div>
      <main className={styles.mainContent}>
        <header className={styles.pageHeader}><h1>Newsfeed</h1><p>See what's new in the ULIC community.</p></header>
        <div className={styles.feedContainer}>
          <CreatePost onPostCreated={fetchPosts} />
          {loading ? <p className={styles.loadingText}>Loading feed...</p> : posts.map(post => <PostCard key={post.id} post={post} onPostDeleted={fetchPosts} onShare={() => handleShareClick(post)} onEdit={() => setEditingPost(post)} />)}
        </div>
      </main>
      {showShareModal && selectedPostForShare && <ShareModal post={selectedPostForShare} onClose={() => setShowShareModal(false)} />}
      {editingPost && <EditPostModal post={editingPost} onClose={() => setEditingPost(null)} onPostUpdated={fetchPosts} />}
    </>
  );
}

// --- Sub-components ---

function CreatePost({ onPostCreated }: { onPostCreated: () => void }) {
    const { user } = useAuth();
    const [content, setContent] = useState('');
    const [mediaFile, setMediaFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const supabase = createClient();

    const handlePost = async () => {
        if (!user || (!content.trim() && !mediaFile)) return;
        setLoading(true);
        const toastId = toast.loading('Posting...');
        let mediaUrl = '';

        if (mediaFile) {
            try {
                // **FIX**: Upload to the '/posts/' folder
                const uploadResult = await uploadToImageKit(mediaFile, `post_${user.id}_${Date.now()}`, '/posts/');
                mediaUrl = uploadResult.url;
            } catch (error) {
                toast.error('Media upload failed.', { id: toastId });
                setLoading(false);
                return;
            }
        }

        const { error } = await supabase.from('posts').insert([{ author_id: user.id, content, media_url: mediaUrl || undefined }]);
        if (error) {
            toast.error(error.message, { id: toastId });
        } else {
            toast.success('Post created!', { id: toastId });
            setContent('');
            setMediaFile(null);
            onPostCreated();
        }
        setLoading(false);
    };

    if (!user) return null;

    return (
        <div className={styles.postCard}>
            <div className={styles.createPostContainer}>
                <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="What's on your mind?" rows={3}/>
                <div className={styles.createPostActions}>
                    <input type="file" id="mediaUpload" accept="image/*,video/*" onChange={e => setMediaFile(e.target.files ? e.target.files[0] : null)} style={{display: 'none'}} />
                    <label htmlFor="mediaUpload" className={styles.mediaUploadButton} title={mediaFile ? mediaFile.name : "Add Media"}><i className="far fa-image"></i></label>
                    <button onClick={handlePost} disabled={loading}>{loading ? "..." : "Post"}</button>
                </div>
            </div>
        </div>
    );
}

function PostCard({ post, onPostDeleted, onShare, onEdit }: { post: Post, onPostDeleted: () => void, onShare: () => void, onEdit: () => void }) {
  const { user, role } = useAuth();
  const supabase = createClient();
  const author = post.profiles;
  const isAdmin = role === 'admin';
  const isAuthor = user?.id === post.author_id;

  const handleLike = async () => { /* ... */ };
  const handleSave = async () => { /* ... */ };

  const handleDelete = async () => {
      if (!confirm("Are you sure you want to delete this post?")) return;
      const toastId = toast.loading("Deleting post...");
      const { error } = await supabase.from('posts').delete().eq('id', post.id);
      if(error) toast.error(error.message, { id: toastId });
      else {
          toast.success("Post deleted.", { id: toastId });
          onPostDeleted();
      }
  };

  return (
    <div className={styles.postCard}>
      <div className={styles.postHeader}>
        <Image src={author?.avatar_url || '/user-icon.png'} alt={author?.full_name || 'User'} width={50} height={50} />
        <div className={styles.postAuthorInfo}>
          <Link href={`/profile/${author?.username}`}>{author?.full_name}</Link>
          <span>{new Date(post.created_at).toLocaleString()}</span>
        </div>
        {(isAdmin || isAuthor) && (
            <div className={styles.postMenu}>
                {isAuthor && <button onClick={onEdit} title="Edit Post"><i className="fas fa-edit"></i></button>}
                <button onClick={handleDelete} title="Delete Post"><i className="fas fa-trash"></i></button>
            </div>
        )}
      </div>
      <div className={styles.postContent}>
        <p>{post.content}</p>
        {post.media_url && <Image src={post.media_url} alt="Post media" width={600} height={400} className={styles.postMedia} />}
      </div>
      <div className={styles.postActions}>
        <button onClick={handleLike}><i className="far fa-heart"></i> Like</button>
        <button onClick={onShare}><i className="far fa-share-square"></i> Share</button>
        <button onClick={handleSave}><i className="far fa-bookmark"></i> Save</button>
      </div>
    </div>
  );
}

function ShareModal({ post, onClose }: { post: Post, onClose: () => void }) { /* ... */ }

// **NEW**: Edit Post Modal Component
function EditPostModal({ post, onClose, onPostUpdated }: { post: Post, onClose: () => void, onPostUpdated: () => void }) {
    const { user } = useAuth();
    const [content, setContent] = useState(post.content);
    const [mediaFile, setMediaFile] = useState<File | null>(null);
    const [currentMediaUrl, setCurrentMediaUrl] = useState(post.media_url);
    const [loading, setLoading] = useState(false);
    const supabase = createClient();

    const handleUpdate = async () => {
        if (!user) return;
        setLoading(true);
        const toastId = toast.loading('Updating post...');
        let newMediaUrl = currentMediaUrl;

        if (mediaFile) {
            try {
                const uploadResult = await uploadToImageKit(mediaFile, `post_${user.id}_${Date.now()}`, '/posts/');
                newMediaUrl = uploadResult.url;
            } catch (error) {
                toast.error('Media upload failed.', { id: toastId });
                setLoading(false);
                return;
            }
        }
        
        const { error } = await supabase.from('posts').update({ content, media_url: newMediaUrl }).eq('id', post.id);

        if (error) {
            toast.error(error.message, { id: toastId });
        } else {
            toast.success('Post updated!', { id: toastId });
            onPostUpdated();
            onClose();
        }
        setLoading(false);
    };

    return (
        <div className={styles.modalBackdrop}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}><h2>Edit Post</h2><button onClick={onClose} className={styles.modalCloseBtn}><i className="fas fa-times"></i></button></div>
                <div className={styles.editPostContainer}>
                    <textarea value={content} onChange={e => setContent(e.target.value)} rows={5} />
                    {currentMediaUrl && <Image src={currentMediaUrl} alt="Current media" width={100} height={100} />}
                    <div className={styles.createPostActions}>
                         <input type="file" id="editMediaUpload" accept="image/*,video/*" onChange={e => setMediaFile(e.target.files ? e.target.files[0] : null)} style={{display: 'none'}} />
                         <label htmlFor="editMediaUpload" className={styles.mediaUploadButton} title={mediaFile ? mediaFile.name : "Change Media"}><i className="far fa-image"></i></label>
                        <button onClick={handleUpdate} disabled={loading}>{loading ? "Saving..." : "Save Changes"}</button>
                    </div>
                </div>
            </div>
        </div>
    );
}