import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, where, DocumentData, QueryConstraint, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { perfTracker } from '../utils/performance';

const logError = (operation: string, collectionName: string, error: any) => {
  const code = error?.code || 'unknown';
  const message = error?.message || String(error);
  console.error(`[Firestore DB Error - ${operation}] Collection: ${collectionName}, Code: ${code}, Message: ${message}`, error);
};

const measureQuery = async <T>(name: string, queryFn: () => Promise<T>): Promise<T> => {
  const start = performance.now();
  try {
    return await queryFn();
  } finally {
    const duration = performance.now() - start;
    console.log(`[PERF] Firestore Query "${name}" took ${duration.toFixed(2)} ms`);
    perfTracker.trackQuery(name);
  }
};

// Request deduplication cache
const queryPromises: Record<string, Promise<any>> = {};

export const getCollection = async <T>(collectionName: string, queryConstraints: QueryConstraint[] = []): Promise<T[]> => {
  const queryKey = `getDocs_${collectionName}_${JSON.stringify(queryConstraints)}`;
  
  if (queryPromises[queryKey]) {
    return queryPromises[queryKey];
  }

  const fetchPromise = measureQuery(`getDocs(${collectionName})`, async () => {
    try {
      const q = query(collection(db, collectionName), ...queryConstraints);
      console.log(`[DEBUG] Fetching collection: ${collectionName}`);
      
      const getDocsPromise = getDocs(q);
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Firestore fetch timeout')), 5000)
      );
      
      const snapshot = await Promise.race([getDocsPromise, timeoutPromise]) as any;
      
      console.log(`[DEBUG] Fetched ${collectionName}, docs count: ${snapshot?.docs?.length || 0}`);
      
      if (!snapshot || !snapshot.docs) {
        console.warn(`[DEBUG] getDocs(${collectionName}) returned snapshot without docs.`);
        return [];
      }
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as unknown as T));
      
      // Cache successfully fetched collection
      try {
        localStorage.setItem(`local_cache_db_${collectionName}`, JSON.stringify(data));
      } catch (e) {
        console.warn('Failed to cache collection locally:', e);
      }
      
      return data;
    } catch (error) {
      logError('getCollection', collectionName, error);
      
      // FIX: Clear the promise cache on error so retries can happen
      delete queryPromises[queryKey];
      
      // If offline/unavailable, return cached local storage data
      const cached = localStorage.getItem(`local_cache_db_${collectionName}`);
      if (cached) {
        console.warn(`Firestore is offline. Returning cached data for collection "${collectionName}".`);
        return JSON.parse(cached) as T[];
      }
      return [];
    }
  });

  queryPromises[queryKey] = fetchPromise;
  return fetchPromise;
};

export const getDocument = async <T>(collectionName: string, id: string): Promise<T | null> => {
  const queryKey = `getDoc_${collectionName}_${id}`;
  
  if (queryPromises[queryKey]) {
    return queryPromises[queryKey];
  }

  const fetchPromise = measureQuery(`getDoc(${collectionName}/${id})`, async () => {
    try {
      const docRef = doc(db, collectionName, id);
      const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      const data = { id: snapshot.id, ...snapshot.data() } as unknown as T;
      // Update individual document in the cached collection
      try {
        const cachedCollectionStr = localStorage.getItem(`local_cache_db_${collectionName}`);
        let cachedCollection: any[] = cachedCollectionStr ? JSON.parse(cachedCollectionStr) : [];
        const index = cachedCollection.findIndex((item: any) => item.id === id);
        if (index > -1) {
          cachedCollection[index] = data;
        } else {
          cachedCollection.push(data);
        }
        localStorage.setItem(`local_cache_db_${collectionName}`, JSON.stringify(cachedCollection));
      } catch (e) {
        console.warn('Failed to update document in local cache:', e);
      }
      return data;
    }
    return null;
  } catch (error) {
    logError(`getDocument(${id})`, collectionName, error);
    // Try to find the document in the cached collection
    const cachedCollectionStr = localStorage.getItem(`local_cache_db_${collectionName}`);
    if (cachedCollectionStr) {
      const cachedCollection: any[] = JSON.parse(cachedCollectionStr);
      const docItem = cachedCollection.find((item: any) => item.id === id);
      if (docItem) {
        console.warn(`Firestore is offline. Returning cached document for id "${id}".`);
        return docItem as T;
      }
    }
    return null;
  }
  });

  queryPromises[queryKey] = fetchPromise;
  return fetchPromise;
};

export const createDocument = async <T>(collectionName: string, data: Partial<T>): Promise<string> => {
  const localId = 'local_' + Math.random().toString(36).substr(2, 9);
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    const finalId = docRef.id;
    // Update local cache
    try {
      const cachedCollectionStr = localStorage.getItem(`local_cache_db_${collectionName}`);
      let cachedCollection: any[] = cachedCollectionStr ? JSON.parse(cachedCollectionStr) : [];
      cachedCollection.push({ ...data, id: finalId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
      localStorage.setItem(`local_cache_db_${collectionName}`, JSON.stringify(cachedCollection));
    } catch (e) {
      console.warn('Failed to update local cache on create:', e);
    }
    return finalId;
  } catch (error) {
    logError('createDocument', collectionName, error);
    // Offline fallback: simulate successful write in local storage
    try {
      const cachedCollectionStr = localStorage.getItem(`local_cache_db_${collectionName}`);
      let cachedCollection: any[] = cachedCollectionStr ? JSON.parse(cachedCollectionStr) : [];
      cachedCollection.push({ ...data, id: localId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
      localStorage.setItem(`local_cache_db_${collectionName}`, JSON.stringify(cachedCollection));
    } catch (e) {
      console.warn('Failed to update local cache on fallback create:', e);
    }
    return localId;
  }
};

export const updateDocument = async <T>(collectionName: string, id: string, data: Partial<T>): Promise<void> => {
  try {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
    // Update local cache
    try {
      const cachedCollectionStr = localStorage.getItem(`local_cache_db_${collectionName}`);
      if (cachedCollectionStr) {
        let cachedCollection: any[] = JSON.parse(cachedCollectionStr);
        const index = cachedCollection.findIndex((item: any) => item.id === id);
        if (index > -1) {
          cachedCollection[index] = { ...cachedCollection[index], ...data, updatedAt: new Date().toISOString() };
          localStorage.setItem(`local_cache_db_${collectionName}`, JSON.stringify(cachedCollection));
        }
      }
    } catch (e) {
      console.warn('Failed to update local cache on update:', e);
    }
  } catch (error) {
    logError(`updateDocument(${id})`, collectionName, error);
    // Offline fallback: simulate update locally
    try {
      const cachedCollectionStr = localStorage.getItem(`local_cache_db_${collectionName}`);
      if (cachedCollectionStr) {
        let cachedCollection: any[] = JSON.parse(cachedCollectionStr);
        const index = cachedCollection.findIndex((item: any) => item.id === id);
        if (index > -1) {
          cachedCollection[index] = { ...cachedCollection[index], ...data, updatedAt: new Date().toISOString() };
          localStorage.setItem(`local_cache_db_${collectionName}`, JSON.stringify(cachedCollection));
        }
      }
    } catch (e) {
      console.warn('Failed to update local cache on fallback update:', e);
    }
  }
};

export const deleteDocument = async (collectionName: string, id: string): Promise<void> => {
  try {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
    // Update local cache
    try {
      const cachedCollectionStr = localStorage.getItem(`local_cache_db_${collectionName}`);
      if (cachedCollectionStr) {
        let cachedCollection: any[] = JSON.parse(cachedCollectionStr);
        cachedCollection = cachedCollection.filter((item: any) => item.id !== id);
        localStorage.setItem(`local_cache_db_${collectionName}`, JSON.stringify(cachedCollection));
      }
    } catch (e) {
      console.warn('Failed to delete from local cache:', e);
    }
  } catch (error) {
    logError(`deleteDocument(${id})`, collectionName, error);
    // Offline fallback: simulate delete locally
    try {
      const cachedCollectionStr = localStorage.getItem(`local_cache_db_${collectionName}`);
      if (cachedCollectionStr) {
        let cachedCollection: any[] = JSON.parse(cachedCollectionStr);
        cachedCollection = cachedCollection.filter((item: any) => item.id !== id);
        localStorage.setItem(`local_cache_db_${collectionName}`, JSON.stringify(cachedCollection));
      }
    } catch (e) {
      console.warn('Failed to delete from local cache on fallback delete:', e);
    }
  }
};
