import { useState, useEffect, useCallback } from 'react';
import { getCollection, addDocument, updateDocument, deleteDocument, deleteImage } from '../services/masterDataService';
import { BaseEntity } from '../types/master';
import { useToast } from '../contexts/ToastContext';

export const useMasterData = <T extends BaseEntity>(collectionName: string) => {
  const [data, setData] = useState<T[]>([]);
  
  useEffect(() => {
    console.log(`[DEBUG] useMasterData(${collectionName}) data initialized:`, data);
  }, [data, collectionName]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToast();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getCollection<T>(collectionName);
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [collectionName]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addRecord = useCallback(async (record: Omit<T, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const id = await addDocument(collectionName, record);
      await fetchData();
      addToast(`Record added successfully`, 'success');
      return id;
    } catch (err: any) {
      addToast(err.message || 'Failed to add record', 'error');
      throw err;
    }
  }, [collectionName, fetchData, addToast]);

  const updateRecord = useCallback(async (id: string, record: Partial<T>) => {
    try {
      await updateDocument(collectionName, id, record);
      await fetchData();
      addToast(`Record updated successfully`, 'success');
    } catch (err: any) {
      addToast(err.message || 'Failed to update record', 'error');
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
      addToast(`Record deleted successfully`, 'success');
    } catch (err: any) {
      addToast(err.message || 'Failed to delete record', 'error');
      throw err;
    }
  };

  return { data, loading, error, fetchData, addRecord, updateRecord, deleteRecord };
};
