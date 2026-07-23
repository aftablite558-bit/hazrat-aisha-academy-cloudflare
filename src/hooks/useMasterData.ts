import { useState, useEffect, useCallback } from 'react';
import { getCollection, addDocument, updateDocument, deleteDocument, deleteImage } from '../services/masterDataService';
import { BaseEntity } from '../types/master';
import { useToast } from '../contexts/ToastContext';
import { useSession } from '../contexts/SessionContext';

export const useMasterData = <T extends BaseEntity>(collectionName: string, withSession: boolean = false) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToast();
  const { activeSession } = useSession();

  const fetchData = useCallback(async (params: Record<string, string | number> = {}) => {
    if (withSession && !activeSession) return;
    
    setLoading(true);
    setError(null);
    try {
      const queryParams = { ...params };
      if (withSession && activeSession) {
        queryParams.sessionId = activeSession.id;
      }
      const result = await getCollection<T>(collectionName, queryParams);
      setData(result);
    } catch (err: unknown) {
      setError((err instanceof Error ? err.message : String(err)) || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [collectionName, withSession, activeSession]);

  useEffect(() => {
    if (!withSession || activeSession) {
      fetchData();
    }

    const handleDataChanged = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail.collectionName === collectionName) {
        fetchData();
      }
    };

    window.addEventListener('masterDataChanged', handleDataChanged);
    return () => window.removeEventListener('masterDataChanged', handleDataChanged);
  }, [fetchData, withSession, activeSession, collectionName]);

  const addRecord = useCallback(async (record: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>) => {
    try {
      const dataToSave = { ...record };
      if (withSession && activeSession) {
        (dataToSave as Partial<T> & { sessionId?: string }).sessionId = activeSession.id;
      }
      const id = await addDocument(collectionName, dataToSave);
      await fetchData();
      window.dispatchEvent(new CustomEvent('masterDataChanged', { detail: { collectionName } }));
      addToast(`Record added successfully`, 'success');
      return id;
    } catch (err: unknown) {
      addToast((err instanceof Error ? err.message : String(err)) || 'Failed to add record', 'error');
      throw err;
    }
  }, [collectionName, withSession, activeSession, fetchData, addToast]);

  const updateRecord = useCallback(async (id: string, record: Partial<T>) => {
    try {
      await updateDocument(collectionName, id, record);
      await fetchData();
      window.dispatchEvent(new CustomEvent('masterDataChanged', { detail: { collectionName } }));
      addToast(`Record updated successfully`, 'success');
    } catch (err: unknown) {
      addToast((err instanceof Error ? err.message : String(err)) || 'Failed to update record', 'error');
      throw err;
    }
  }, [collectionName, fetchData, addToast]);

  const deleteRecord = async (id: string) => {
    try {
      const itemToDelete = data.find(item => item.id === id);
      await deleteDocument(collectionName, id);

      if (itemToDelete) {
        Object.values(itemToDelete).forEach((val) => {
          if (
            typeof val === 'string' &&
            val.startsWith('http') &&
            (val.includes('/storage/v1/object/public/') || val.includes('.supabase.co/storage/'))
          ) {
            deleteImage(val).catch(err => console.error('Failed to cleanup file on deletion:', err));
          }
        });
      }

      await fetchData();
      window.dispatchEvent(new CustomEvent('masterDataChanged', { detail: { collectionName } }));
      addToast(`Record deleted successfully`, 'success');
    } catch (err: unknown) {
      addToast((err instanceof Error ? err.message : String(err)) || 'Failed to delete record', 'error');
      throw err;
    }
  };

  return { data, loading, error, fetchData, addRecord, updateRecord, deleteRecord };
};
