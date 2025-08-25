'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
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
  media_urls?: string[];
  created_at: string;
  profiles: { username: string; full_name: string; avatar_url: string; } | null;
  likes: { user_id: string }[];
};

type SavedItem = {
    item_id: string;
    item_type: string;
}

// --- Main Component ---
export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]); // State for saved items
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [sharePost, setSharePost] = useState<Post | null>(null);
  const supabase = createClient();
  const { user } = useAuth();

  const fetchData = useCallback(async () => {
    setLoading(true);
    // Fetch posts and saved items concurrently
    const [postsRes, savedRes] = await Promise.all([
        supabase.rpc('get_posts_for_newsfeed'),
        user ? supabase.from('saved_items').select('item_id, item_type').eq('user_id', user.id) : Promise.resolve({ data: [], error: null })
    ]);
    
    if (postsRes.error) {
      console.error("Supabase RPC error:", postsRes.error);
      toast.error(`Could not load newsfeed: ${postsRes.error.message}`);
    } else {
      setPosts(postsRes.data as Post[]);
    }
    
    if (savedRes.error) {
        toast.error("Could not fetch saved items.");
    } else {
        setSavedItems(savedRes.data || []);
    }

    setLoading(false);
  }, [supabase, user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      <div className={styles.backgroundShapes}><div className={`${styles.shape} ${styles.shape1}`}></div><div className={`${styles.shape} ${styles.shape2}`}></div></div>
      <main className={styles.mainContent}>
        <header className={styles.pageHeader}><h1>Newsfeed</h1><p>See what's new in the ULIC community.</p></header>
        <div className={styles.feedContainer}>
          <CreatePost onPostCreated={fetchData} />
          {loading ? (
            <p className={styles.loadingText}>Loading feed...</p>
          ) : (
            posts.map(post => 
              <PostCard 
                key={post.id} 
                post={post} 
                setPosts={setPosts}
                isInitiallySaved={savedItems.some(item => item.item_id === post.id)} // Pass saved state
                setSavedItems={setSavedItems} // Pass setter to update saved state
                onPostDeleted={fetchData}
                onEdit={() => setEditingPost(post)}
                onShare={() => setSharePost(post)}
              />)
          )}
        </div>
      </main>
      {editingPost && <EditPostModal post={editingPost} onClose={() => setEditingPost(null)} onPostUpdated={fetchData} />}
      {sharePost && <ShareModal post={sharePost} onClose={() => setSharePost(null)} />}
    </>
  );
}


// --- 1. Create Post Component ---
function CreatePost({ onPostCreated }: { onPostCreated: () => void }) {
    const { user, fullName, avatarUrl } = useAuth();
    const [content, setContent] = useState('');
    const [mediaFiles, setMediaFiles] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showUploadOptions, setShowUploadOptions] = useState(false);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);
    const docInputRef = useRef<HTMLInputElement>(null);
    const uploadMenuRef = useRef<HTMLDivElement>(null);
    const supabase = createClient();

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (uploadMenuRef.current && !uploadMenuRef.current.contains(event.target as Node)) {
                setShowUploadOptions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [uploadMenuRef]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) setMediaFiles(prev => [...prev, ...Array.from(e.target.files!)]);
        setShowUploadOptions(false);
    };
    const removeMedia = (index: number) => setMediaFiles(prev => prev.filter((_, i) => i !== index));
    const handlePost = async () => {
        if (!user || (!content.trim() && mediaFiles.length === 0)) return;
        setIsSubmitting(true);
        const toastId = toast.loading('Creating your post...');
        let mediaUrls: string[] = [];
        if (mediaFiles.length > 0) {
            try {
                const uploadPromises = mediaFiles.map(file => uploadToImageKit(file, `post_${user.id}_${Date.now()}_${file.name}`, '/posts/'));
                const results = await Promise.all(uploadPromises);
                mediaUrls = results.map(res => res.url);
            } catch (error) { toast.error('Media upload failed.', { id: toastId }); setIsSubmitting(false); return; }
        }
        const { error } = await supabase.from('posts').insert([{ author_id: user.id, content, media_urls: mediaUrls.length > 0 ? mediaUrls : undefined }]);
        if (error) { toast.error(error.message, { id: toastId }); }
        else { toast.success('Post created!', { id: toastId }); setContent(''); setMediaFiles([]); onPostCreated(); }
        setIsSubmitting(false);
    };

    if (!user) return null;
    return (
        <div className={styles.postCard}>
            <div className={styles.createPostContainer}>
                <Image src={avatarUrl || '/user-icon.png'} alt="Your avatar" width={40} height={40} />
                <div className={styles.postInputArea}>
                    <textarea value={content} onChange={e => setContent(e.target.value)} placeholder={`What's on your mind, ${fullName}?`} rows={mediaFiles.length > 0 ? 2 : 1} />
                    {mediaFiles.length > 0 && (<div className={styles.mediaPreviewContainer}>{mediaFiles.map((file, index) => (<div key={index} className={styles.mediaPreviewItem}><Image src={URL.createObjectURL(file)} alt="Preview" width={80} height={80} /><button onClick={() => removeMedia(index)} className={styles.removeMediaBtn}><i className="fas fa-times"></i></button></div>))}</div>)}
                    <div className={styles.createPostActions}><div className={styles.uploadWrapper} ref={uploadMenuRef}><button onClick={() => setShowUploadOptions(prev => !prev)} className={styles.addMediaButton} title="Add Media"><i className="fas fa-plus"></i></button>{showUploadOptions && (<div className={styles.uploadOptionsMenu}><button onClick={() => imageInputRef.current?.click()}><i className="far fa-image"></i> Image</button><button onClick={() => videoInputRef.current?.click()}><i className="fas fa-video"></i> Video</button><button onClick={() => docInputRef.current?.click()}><i className="far fa-file-alt"></i> Document</button></div>)}<input type="file" ref={imageInputRef} onChange={handleFileChange} multiple style={{ display: 'none' }} accept="image/*" /><input type="file" ref={videoInputRef} onChange={handleFileChange} multiple style={{ display: 'none' }} accept="video/*" /><input type="file" ref={docInputRef} onChange={handleFileChange} multiple style={{ display: 'none' }} accept=".pdf,.doc,.docx,.txt" /></div><button onClick={handlePost} disabled={isSubmitting}>{isSubmitting ? "Posting..." : "Post"}</button></div>
                </div>
            </div>
        </div>
    );
}

// --- 2. Post Card Component (FIX #3) ---
function PostCard({ post, setPosts, isInitiallySaved, setSavedItems, onPostDeleted, onEdit, onShare }: { post: Post, setPosts: React.Dispatch<React.SetStateAction<Post[]>>, isInitiallySaved: boolean, setSavedItems: React.Dispatch<React.SetStateAction<SavedItem[]>>, onPostDeleted: () => void, onEdit: () => void, onShare: () => void }) {
    const { user } = useAuth();
    const supabase = createClient();
    const [isExpanded, setIsExpanded] = useState(false);
    const [mediaModalOpen, setMediaModalOpen] = useState(false);
    const [modalStartIndex, setModalStartIndex] = useState(0);
    const [showPostMenu, setShowPostMenu] = useState(false);
    const postMenuRef = useRef<HTMLDivElement>(null);

    const isAuthor = user?.id === post.author_id;
    const author = post.profiles;
    const userHasLiked = post.likes.some(like => like.user_id === user?.id);
    const isLongPost = post.content && post.content.length > 200;

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (postMenuRef.current && !postMenuRef.current.contains(event.target as Node)) setShowPostMenu(false);
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [postMenuRef]);

    const handleLike = async () => {
        if (!user) return toast.error("You must be logged in to like a post.");
        setPosts(prev => prev.map(p => p.id === post.id ? { ...p, likes: userHasLiked ? p.likes.filter(l => l.user_id !== user.id) : [...p.likes, { user_id: user.id }] } : p));
        if (userHasLiked) { await supabase.from('likes').delete().match({ user_id: user.id, target_id: post.id }); } 
        else { await supabase.from('likes').insert({ user_id: user.id, target_id: post.id, target_type: 'post' }); }
    };
    
    // FIX #3: Implement Save/Unsave Logic
    const handleSaveToggle = async () => {
        if (!user) return toast.error("You must be logged in to save posts.");
        
        if (isInitiallySaved) { // Unsave logic
            setSavedItems(prev => prev.filter(item => item.item_id !== post.id)); // Optimistic UI update
            const { error } = await supabase.from('saved_items').delete().match({ user_id: user.id, item_id: post.id });
            if (error) toast.error("Failed to unsave post.");
            else toast.success("Post unsaved.");
        } else { // Save logic
            setSavedItems(prev => [...prev, { item_id: post.id, item_type: 'post' }]); // Optimistic UI update
            const { error } = await supabase.from('saved_items').insert({ user_id: user.id, item_id: post.id, item_type: 'post' });
            if (error) toast.error("Failed to save post.");
            else toast.success("Post saved!");
        }
        setShowPostMenu(false);
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this post?")) return;
        const toastId = toast.loading("Deleting post...");
        const { error } = await supabase.from('posts').delete().eq('id', post.id);
        if (error) { toast.error(error.message, { id: toastId }); } 
        else { toast.success("Post deleted.", { id: toastId }); onPostDeleted(); }
        setShowPostMenu(false);
    };
    
    const parseContent = (text: string) => {
        if (!text) return { __html: '' };
        const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
        const mentionRegex = /@(\w+)/g;
        let html = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        html = html.replace(urlRegex, (url) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`);
        html = html.replace(mentionRegex, `<a href="/profile/$1" class="mention-link">@$1</a>`);
        return { __html: html.replace(/\n/g, '<br />') };
    };

    return (
        <>
            <div className={styles.postCard}>
                <div className={styles.postHeader}>
                    {author && <Image src={author.avatar_url || '/user-icon.png'} alt={author.full_name || 'User'} width={50} height={50} />}
                    <div className={styles.postAuthorInfo}><Link href={`/profile/${author?.username}`}>{author?.full_name}</Link><span>{new Date(post.created_at).toLocaleString()}</span></div>
                    <div className={styles.postMenu} ref={postMenuRef}>
                        <button onClick={() => setShowPostMenu(prev => !prev)} className={styles.postMenuButton} title="More options"><i className="fas fa-ellipsis-h"></i></button>
                        {showPostMenu && (
                            <div className={styles.postMenuContent}>
                                <button onClick={handleSaveToggle}>
                                    <i className={isInitiallySaved ? "fas fa-bookmark" : "far fa-bookmark"}></i> 
                                    {isInitiallySaved ? 'Unsave Post' : 'Save Post'}
                                </button>
                                {isAuthor && (
                                    <>
                                        <button onClick={() => { onEdit(); setShowPostMenu(false); }}><i className="fas fa-edit"></i> Edit Post</button>
                                        <button onClick={handleDelete} className={styles.deleteOption}><i className="fas fa-trash"></i> Delete Post</button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                <div className={styles.postContent}>
                    <div dangerouslySetInnerHTML={parseContent(isLongPost && !isExpanded ? post.content.substring(0, 200) : post.content)} />
                    {isLongPost && (<button onClick={() => setIsExpanded(!isExpanded)} className={styles.seeMoreBtn}>{isExpanded ? 'See Less' : '...See More'}</button>)}
                    {post.media_urls && post.media_urls.length > 0 && <MediaGrid mediaUrls={post.media_urls} onImageClick={(index) => { setModalStartIndex(index); setMediaModalOpen(true); }} />}
                </div>
                <div className={styles.postActions}>
                    <button onClick={handleLike} className={userHasLiked ? styles.liked : ''}><i className="far fa-heart"></i> Like ({post.likes.length})</button>
                    <button onClick={onShare}><i className="far fa-share-square"></i> Share</button>
                </div>
            </div>
            {mediaModalOpen && <MediaModal mediaUrls={post.media_urls || []} startIndex={modalStartIndex} onClose={() => setMediaModalOpen(false)} />}
        </>
    );
}

// --- 3. MediaGrid Component (RESTORED) ---
function MediaGrid({ mediaUrls, onImageClick }: { mediaUrls: string[], onImageClick: (index: number) => void }) {
    const gridClass = `grid-${Math.min(mediaUrls.length, 4)}`;
    return (
        <div className={`${styles.mediaGrid} ${styles[gridClass]}`}>
            {mediaUrls.slice(0, 4).map((url, index) => (
                <div key={url} className={styles.mediaGridItem} onClick={() => onImageClick(index)}>
                    <Image src={url} alt={`Post media ${index + 1}`} layout="fill" objectFit="cover" />
                    {mediaUrls.length > 4 && index === 3 && (
                        <div className={styles.moreItemsOverlay}>
                            +{mediaUrls.length - 3}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}


// --- 4. MediaModal Component (RESTORED & FIXED) ---
function MediaModal({ mediaUrls, startIndex, onClose }: { mediaUrls: string[], startIndex: number, onClose: () => void }) {
    const [currentIndex, setCurrentIndex] = useState(startIndex);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const goToNext = useCallback(() => setCurrentIndex((prev) => (prev + 1) % mediaUrls.length), [mediaUrls.length]);
    const goToPrev = useCallback(() => setCurrentIndex((prev) => (prev - 1 + mediaUrls.length) % mediaUrls.length), [mediaUrls.length]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') isFullscreen ? setIsFullscreen(false) : onClose();
            if (!isFullscreen) { if (e.key === 'ArrowRight') goToNext(); if (e.key === 'ArrowLeft') goToPrev(); }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFullscreen, onClose, goToNext, goToPrev]);

    return (
        <div className={`${styles.mediaModalBackdrop} ${isFullscreen ? styles.fullscreen : ''}`}>
             <div className={styles.modalHeader}>
                <span>{currentIndex + 1} / {mediaUrls.length}</span>
                <div className={styles.modalActions}>
                    <button onClick={() => setIsFullscreen(!isFullscreen)} title="Toggle Fullscreen"><i className={`fas ${isFullscreen ? 'fa-compress' : 'fa-expand'}`}></i></button>
                    <button onClick={onClose} title="Close"><i className="fas fa-times"></i></button>
                </div>
            </div>
            {!isFullscreen && mediaUrls.length > 1 && <button onClick={goToPrev} className={`${styles.modalNav} ${styles.prev}`}><i className="fas fa-chevron-left"></i></button>}
            <div className={styles.modalImageContainer}><Image src={mediaUrls[currentIndex]} alt="Media" layout="fill" objectFit="contain" /></div>
            {!isFullscreen && mediaUrls.length > 1 && <button onClick={goToNext} className={`${styles.modalNav} ${styles.next}`}><i className="fas fa-chevron-right"></i></button>}
        </div>
    );
}

// --- 5. Share & Edit Modals (Unchanged) ---
function ShareModal({ post, onClose }: { post: Post, onClose: () => void }) {
    const postUrl = `${window.location.origin}/post/${post.id}`;
    const text = encodeURIComponent(post.content ? post.content.substring(0, 100) + "..." : "Check out this post!");
    const platforms = [
        { name: 'Copy Link', icon: 'fas fa-copy', action: () => { navigator.clipboard.writeText(postUrl); toast.success("Link copied!"); } },
        { name: 'X (Twitter)', icon: 'fab fa-twitter', url: `https://twitter.com/intent/tweet?url=${postUrl}&text=${text}` },
        { name: 'Facebook', icon: 'fab fa-facebook', url: `https://www.facebook.com/sharer/sharer.php?u=${postUrl}` },
        { name: 'Messenger', icon: 'fab fa-facebook-messenger', url: `fb-messenger://share/?link=${postUrl}` },
        { name: 'WhatsApp', icon: 'fab fa-whatsapp', url: `https://api.whatsapp.com/send?text=${text}%20${postUrl}` },
        { name: 'Telegram', icon: 'fab fa-telegram-plane', url: `https://t.me/share/url?url=${postUrl}&text=${text}` },
        { name: 'Reddit', icon: 'fab fa-reddit-alien', url: `https://www.reddit.com/submit?url=${postUrl}&title=${encodeURIComponent(post.profiles?.full_name || "Post")}` },
    ];
    return (
        <div className={styles.actionModalBackdrop} onClick={onClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <div className={styles.modalHeader}><h2>Share Post</h2><button onClick={onClose} className={styles.modalCloseBtn}><i className="fas fa-times"></i></button></div>
                <div className={styles.shareGrid}>{platforms.map(p => (<a key={p.name} href={p.url || '#'} onClick={p.action ? p.action : undefined} target="_blank" rel="noopener noreferrer" className={styles.shareOption}><i className={p.icon}></i><span>{p.name}</span></a>))}</div>
            </div>
        </div>
    );
}
function EditPostModal({ post, onClose, onPostUpdated }: { post: Post, onClose: () => void, onPostUpdated: () => void }) {
    const [content, setContent] = useState(post.content);
    const [loading, setLoading] = useState(false);
    const supabase = createClient();
    const handleUpdate = async () => {
        setLoading(true);
        const toastId = toast.loading('Updating post...');
        const { error } = await supabase.from('posts').update({ content }).eq('id', post.id);
        if (error) { toast.error(error.message, { id: toastId }); } 
        else { toast.success('Post updated!', { id: toastId }); onPostUpdated(); onClose(); }
        setLoading(false);
    };
    return (
        <div className={styles.actionModalBackdrop}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}><h2>Edit Post</h2><button onClick={onClose} className={styles.modalCloseBtn}><i className="fas fa-times"></i></button></div>
                <div className={styles.editPostContainer}><textarea value={content} onChange={e => setContent(e.target.value)} rows={5} /><div className={styles.editActions}><button onClick={handleUpdate} className={styles.btnPrimary} disabled={loading}>{loading ? "Saving..." : "Save Changes"}</button></div></div>
            </div>
        </div>
    );
}