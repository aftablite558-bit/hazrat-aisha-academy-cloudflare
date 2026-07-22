import { api } from './apiClient';

export const getCollection = async <T>(collectionName: string, params: Record<string, string | number> = {}): Promise<T[]> => {
  const query = new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)])).toString();
  return await api.get(`/collection/${collectionName}${query ? '?' + query : ''}`);
};

export const getDocument = async <T>(collectionName: string, id: string): Promise<T | null> => {
  return await api.get(`/collection/${collectionName}/${id}`);
};

export const createDocument = async <T>(collectionName: string, data: Partial<T>): Promise<string> => {
  const result = await api.post(`/collection/${collectionName}`, data);
  return result.id;
};

export const updateDocument = async <T>(collectionName: string, id: string, data: Partial<T>): Promise<void> => {
  await api.post(`/collection/${collectionName}/${id}/update`, data);
};

export const deleteDocument = async (collectionName: string, id: string): Promise<void> => {
  await api.post(`/collection/${collectionName}/${id}/delete`, {});
};
