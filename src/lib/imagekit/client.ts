// This function now fetches authentication parameters from our secure API route.
const getImageKitAuth = async () => {
    const response = await fetch('/api/imagekit-auth');
    if (!response.ok) {
        throw new Error('Failed to fetch ImageKit authentication parameters.');
    }
    return response.json();
};

export const uploadToImageKit = async (file: Blob, fileName: string, folder: string = '/') => {
    const authData = await getImageKitAuth();
    const formData = new FormData();

    formData.append('file', file);
    formData.append('fileName', fileName);
    formData.append('publicKey', process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!);
    formData.append('signature', authData.signature);
    formData.append('expire', String(authData.expire));
    formData.append('token', authData.token);
    formData.append('folder', folder); // Specify the folder

    const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`ImageKit upload failed: ${errorData.message}`);
    }

    return response.json();
};