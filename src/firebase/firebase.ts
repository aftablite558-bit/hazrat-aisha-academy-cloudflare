import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, memoryLocalCache } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

let databaseId = import.meta.env.VITE_FIREBASE_DATABASE_ID;

// If databaseId is empty or undefined, fallback to '(default)' (the standard default database).
if (!databaseId) {
  databaseId = '(default)';
}

const finalDatabaseId = databaseId === '(default)' ? undefined : databaseId;

// Always use HTTP long-polling and memory local cache in the sandboxed preview environment
// to avoid the "Failed to get document because the client is offline" WebSocket error.
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  useFetchStreams: false,
  localCache: memoryLocalCache(),
}, finalDatabaseId);

export let analytics: any;

if (typeof window !== 'undefined' && firebaseConfig.measurementId) {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}
