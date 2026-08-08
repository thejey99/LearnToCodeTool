import { initializeApp, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as fbSignOut,
  onAuthStateChanged,
  type Auth,
  type User,
} from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

/**
 * Cloud sync is optional. With Firebase env vars set, progress follows you
 * between devices. Without them the app still runs end to end and saves
 * locally — which is what makes it possible to clone this repo and start
 * learning in one command.
 */
export const REMOTE_ENABLED = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId
);

/** Only these accounts may use the hosted app. Mirror this list in Firestore rules. */
export const ALLOWED_EMAILS = [
  'john99ryan@gmail.com',
  'second@example.com',
];

export function isAllowed(user: User | null): boolean {
  return !!user?.email && ALLOWED_EMAILS.includes(user.email.toLowerCase());
}

let app: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;

if (REMOTE_ENABLED) {
  app = initializeApp(firebaseConfig);
  authInstance = getAuth(app);
  dbInstance = getFirestore(app);
}

export const auth = authInstance;
export const db = dbInstance;

export async function signIn(): Promise<void> {
  if (!authInstance) return;
  await signInWithPopup(authInstance, new GoogleAuthProvider());
}

export async function signOut(): Promise<void> {
  if (!authInstance) return;
  await fbSignOut(authInstance);
}

export function watchAuth(cb: (user: User | null) => void): () => void {
  if (!authInstance) {
    cb(null);
    return () => {};
  }
  return onAuthStateChanged(authInstance, cb);
}
