import { initializeApp } from 'firebase/app';
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from 'firebase/storage';

// Your Firebase configuration object
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

class FirebaseStorage {
  static generateUniquePath(fileName, folder) {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const extension = fileName.split('.').pop();
    return `${folder}/${timestamp}-${randomString}.${extension}`;
  }

  static async uploadImage(image, path, maxSizeMB = 5) {
    // Validate file type
    if (!image.type.startsWith('image/')) {
      throw new Error('File must be an image');
    }

    // Validate file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (image.size > maxSizeBytes) {
      throw new Error(`Image size must be less than ${maxSizeMB}MB`);
    }

    try {
      // Use the pre-initialized storage instance
      const storageRef = ref(storage, path);

      // Upload the file
      const snapshot = await uploadBytes(storageRef, image);

      // Get the download URL
      const downloadURL = await getDownloadURL(snapshot.ref);

      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }
}

export { FirebaseStorage };


