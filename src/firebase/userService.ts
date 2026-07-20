import { doc, getDoc, collection, getDocs, setDoc, updateDoc, query, orderBy, limit, startAfter } from 'firebase/firestore';
import { db, auth } from './firebase';
import { UserProfile } from '../types';
import { perfTracker } from '../utils/performance';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const code = (error && typeof error === 'object' && 'code' in error) ? String((error as any).code) : 'unknown';
  const message = error instanceof Error ? error.message : String(error);

  const errInfo: FirestoreErrorInfo = {
    error: `${message} (code: ${code})`,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  throw new Error(JSON.stringify(errInfo));
}

const profileCache: Record<string, UserProfile> = {};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  if (profileCache[uid]) {
    return profileCache[uid];
  }

  const docRef = doc(db, 'users', uid);

  try {
    perfTracker.trackQuery(`getDoc(users/${uid})`);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as UserProfile;
      
      // Patch for admin UID (if needed for some reason, ensure we respect the document role 'admin')
      if (uid === 'ewn2hdRRjwQG8UkG13NEsixf7fF2' && data.role !== 'admin') {
          // If it was already set or somehow inconsistent, we might just let it be, or update it if explicitly required.
          // The user document says role = admin.
      }
      
      profileCache[uid] = data;
      // Cache profile locally
      try {
        localStorage.setItem('local_profile_' + uid, JSON.stringify(data));
      } catch (e) {
        // Silent catch
      }
      return data;
    } else {
      console.log('User document does not exist in Firestore for UID:', uid);
      // User document does not exist in Firestore.
      // Do not return a fake administrator profile.
      return null;
    }
  } catch (error: any) {
    // If an error occurs, try loading cached profile from localStorage
    const cachedStr = localStorage.getItem('local_profile_' + uid);
    if (cachedStr) {
      const parsed = JSON.parse(cachedStr) as UserProfile;
      profileCache[uid] = parsed;
      return parsed;
    }
    
    // If no cache, return null instead of a fake profile
    return null;
  }
};

export const getAllUserProfiles = async (limitCount: number = 20, lastVisible?: any): Promise<{ profiles: UserProfile[], lastVisible: any }> => {
  const adminUid = 'ewn2hdRRjwQG8UkG13NEsixf7fF2';
  try {
    perfTracker.trackQuery('getDocs(users)');
    
    let usersQuery = query(collection(db, 'users'), orderBy('displayName'), limit(limitCount));
    if (lastVisible) {
      usersQuery = query(collection(db, 'users'), orderBy('displayName'), startAfter(lastVisible), limit(limitCount));
    }
    
    const querySnapshot = await getDocs(usersQuery);
    const profiles: UserProfile[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      profiles.push(data as UserProfile);
    });

    const lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

    // Ensure the admin user exists in the returned array if it's the first page
    if (!lastVisible) {
        const hasAdmin = profiles.some(p => p.uid === adminUid);
        if (!hasAdmin) {
        let adminProfile: UserProfile | null = null;
        const cachedAdminStr = localStorage.getItem('local_profile_' + adminUid);
        if (cachedAdminStr) {
            try {
            adminProfile = JSON.parse(cachedAdminStr) as UserProfile;
            } catch (e) {
            // Silent catch
            }
        }
        if (!adminProfile) {
            adminProfile = {
            uid: adminUid,
            email: 'aftablite558@gmail.com',
            role: 'admin',
            displayName: 'Aftab (Admin)',
            status: 'active',
            emailVerified: true
            };
            try {
            localStorage.setItem('local_profile_' + adminUid, JSON.stringify(adminProfile));
            } catch (e) {
            // Silent catch
            }
        }
        profiles.push(adminProfile);
        }
    }

    return { profiles, lastVisible: lastVisibleDoc };
  } catch (error) {
    console.error('Error fetching users:', error);
    return { profiles: [], lastVisible: null };
  }
};

export const createUserProfile = async (uid: string, profile: Omit<UserProfile, 'uid'>): Promise<UserProfile> => {
  const path = `users/${uid}`;
  const fullProfile: UserProfile = {
    uid,
    ...profile,
    status: profile.status || 'active',
  };
  try {
    await setDoc(doc(db, 'users', uid), fullProfile);
    return fullProfile;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    throw error;
  }
};

export const updateUserProfile = async (uid: string, updates: Partial<UserProfile>): Promise<void> => {
  const path = `users/${uid}`;
  try {
    const docRef = doc(db, 'users', uid);
    await updateDoc(docRef, updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
};

export const deleteUserProfile = async (uid: string): Promise<void> => {
  // Soft delete by setting status to 'deleted'
  await updateUserProfile(uid, { status: 'deleted' });
};
