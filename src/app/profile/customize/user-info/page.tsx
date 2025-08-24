'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import styles from '../customize.module.css';
import formStyles from './userInfo.module.css';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { uploadToImageKit } from '@/lib/imagekit/client';

// Imports for the image cropper
import ReactCrop, { centerCrop, makeAspectCrop, Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

// Define a type for the profile data to ensure type safety
type Profile = {
  full_name: string;
  username: string;
  bio: string;
  avatar_url: string;
};

// Helper function to get the cropped image data
function getCroppedImg(image: HTMLImageElement, crop: PixelCrop): Promise<Blob> {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        return Promise.reject(new Error('Canvas context is not available.'));
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        400,
        400
    );

    return new Promise((resolve, reject) => {
        canvas.toBlob(blob => {
            if (!blob) {
                reject(new Error('Canvas is empty.'));
                return;
            }
            resolve(blob);
        }, 'image/png');
    });
}


export default function UserInfoPage() {
  const { user, refreshUser } = useAuth(); // <-- Get refreshUser function
  const supabase = createClient();

  // State for loading and form data
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  // State for image cropping modal
  const [imgSrc, setImgSrc] = useState('');
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [showCropModal, setShowCropModal] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Memoized function to fetch profile data
  const getProfile = useCallback(async () => {
    if (user) {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, username, bio, avatar_url')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        toast.error('Could not load your profile data.');
      } else if (data) {
        setProfile(data);
        setFullName(data.full_name || '');
        setUsername(data.username || '');
        setBio(data.bio || '');
        setAvatarUrl(data.avatar_url || '');
      }
      setLoading(false);
    }
  }, [user, supabase]);

  // Fetch profile on component mount
  useEffect(() => {
    getProfile();
  }, [getProfile]);

  // Function to handle the form submission
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('You must be logged in to update your profile.');
      return;
    }

    const toastId = toast.loading('Updating profile...');
    
    const updates = {
      id: user.id,
      full_name: fullName,
      username,
      bio,
      avatar_url: avatarUrl,
      updated_at: new Date(),
    };

    const { error } = await supabase.from('profiles').upsert(updates);

    if (error) {
      toast.error(error.message, { id: toastId });
    } else {
      toast.success('Profile updated successfully!', { id: toastId });
      await refreshUser(); // <-- REFRESH THE USER DATA HERE
    }
  };
  
  // --- Image Crop and Upload Logic ---

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
        const reader = new FileReader();
        reader.addEventListener('load', () => {
            const image = new window.Image();
            image.src = reader.result?.toString() || '';
            image.onload = () => {
                if (image.width < 400 || image.height < 400) {
                    toast.error('Image must be at least 400x400 pixels.');
                    return;
                }
                setImgSrc(reader.result?.toString() || '');
                setShowCropModal(true);
            };
        });
        reader.readAsDataURL(e.target.files[0]);
    }
  };

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    const crop = centerCrop(
      makeAspectCrop({ unit: 'px', width: 400 }, 1, width, height),
      width,
      height
    );
    setCrop(crop);
  }

  const handleCropAndUpload = async () => {
    if (!completedCrop || !imgRef.current || !user) {
        toast.error("Could not process image. Please try again.");
        return;
    }
    
    setIsUploading(true);
    const toastId = toast.loading('Uploading cropped image...');

    try {
        const croppedBlob = await getCroppedImg(imgRef.current, completedCrop);
        
        // Generate a unique filename
        const fileName = `avatar_${user.id}_${Date.now()}.png`;

        const imageKitResult = await uploadToImageKit(croppedBlob, fileName);
        
        setAvatarUrl(imageKitResult.url); 
        
        toast.success('Image ready! Save your profile to apply.', { id: toastId });
    } catch (error: any) {
        console.error("Upload error:", error);
        toast.error(`Upload failed: ${error.message}`, { id: toastId });
    } finally {
        setIsUploading(false);
        setShowCropModal(false);
    }
  };


  if (loading) {
    return <div>Loading your information...</div>;
  }

  return (
    <div>
      <h1 className={styles.pageHeader}>Edit Your Information</h1>
      <p>Update your public profile details below. Remember to save your changes.</p>

      <form onSubmit={handleUpdateProfile} className={formStyles.formContainer}>
        {/* Avatar Section */}
        <div className={formStyles.avatarSection}>
            <Image 
                src={avatarUrl || '/user-icon.png'} 
                alt="Your Avatar" 
                width={120} 
                height={120} 
                className={formStyles.avatarPreview}
            />
            <div className={formStyles.avatarActions}>
                <label htmlFor="avatar-upload" className={formStyles.btnPrimary}>
                    Upload New Picture
                </label>
                <input 
                    id="avatar-upload"
                    type="file" 
                    accept="image/*" 
                    onChange={onSelectFile}
                    style={{ display: 'none' }}
                />
                <p>Image must be at least 400x400px.</p>
            </div>
        </div>

        {/* Form Fields */}
        <div className={formStyles.formGrid}>
          <div className={formStyles.formGroup}>
            <label htmlFor="fullName">Full Name</label>
            <input id="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="e.g., Jane Doe" />
          </div>
          <div className={formStyles.formGroup}>
            <label htmlFor="username">Username</label>
            <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="e.g., @janedoe" />
          </div>
          <div className={`${formStyles.formGroup} ${formStyles.fullWidth}`}>
            <label htmlFor="bio">Bio</label>
            <textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell us a little about yourself..." rows={4} />
          </div>
        </div>

        {/* Save Button */}
        <div className={formStyles.formActions}>
          <button type="submit" className={formStyles.btnPrimary} disabled={loading || isUploading}>
            {isUploading ? 'Uploading...' : (loading ? 'Saving...' : 'Save Changes')}
          </button>
        </div>
      </form>

      {/* --- Image Cropping Modal --- */}
      {showCropModal && (
        <div className={formStyles.cropModalBackdrop}>
            <div className={formStyles.cropModalContent}>
                <h2>Crop Your Image</h2>
                <p>The image will be cropped to a 400x400 square.</p>
                <ReactCrop
                    crop={crop}
                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                    onComplete={(c) => setCompletedCrop(c)}
                    aspect={1}
                    width={400}
                    height={400}
                    locked={true} 
                >
                    <img
                        ref={imgRef}
                        alt="Crop me"
                        src={imgSrc}
                        onLoad={onImageLoad}
                        style={{ maxHeight: '60vh' }}
                    />
                </ReactCrop>
                <div className={formStyles.cropModalActions}>
                    <button onClick={() => setShowCropModal(false)} className={formStyles.btnSecondary} disabled={isUploading}>Cancel</button>
                    <button onClick={handleCropAndUpload} className={formStyles.btnPrimary} disabled={isUploading}>
                        {isUploading ? 'Uploading...' : 'Crop & Upload'}
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}