import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from '@/firebase/config';

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
function initializeFirebase(): FirebaseApp {
  if (getApps().length > 0) {
    return getApp();
  }

  try {
    // Attempt to initialize via Firebase App Hosting environment variables
    return initializeApp();
  } catch (e) {
    // Fallback for local development or other environments
    if (process.env.NODE_ENV === "production") {
        console.warn('Automatic initialization failed on the server. Falling back to firebase config object.', e);
    }
    return initializeApp(firebaseConfig);
  }
}

export function getSdks() {
  const firebaseApp = initializeFirebase();
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp),
  };
}
