import { useState, useEffect, useCallback } from 'react';
import { getCollection, createDocument, updateDocument, deleteDocument } from '../services/db';
import { deleteImage } from '../services/storage';

export function useCRUD<T extends { id: string }>(collectionName: string) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (params: Record<string, string | number> = {}) => {
    setLoading(true);
    try {
      const result = await getCollection<T>(collectionName, params);
      setData(result);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [collectionName]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const add = async (newItem: Omit<T, 'id'>) => {
    try {
      const id = await createDocument(collectionName, newItem as Partial<T>);
      setData(prev => [...prev, { ...newItem, id } as T]);
      return id;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const update = async (id: string, updatedItem: Partial<T>) => {
    try {
      await updateDocument(collectionName, id, updatedItem);
      setData(prev => prev.map(item => item.id === id ? { ...item, ...updatedItem } : item));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const remove = async (id: string) => {
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

      setData(prev => prev.filter(item => item.id !== id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return { data, loading, error, add, update, remove, refetch: fetchData };
}
