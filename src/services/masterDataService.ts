import { BaseEntity } from '../types/master';
import { uploadImage, deleteImage } from './storage';
import {
  getCollection as dbGetCollection,
  getDocument as dbGetDocument,
  createDocument as dbCreateDocument,
  updateDocument as dbUpdateDocument,
  deleteDocument as dbDeleteDocument
} from './db';

export { uploadImage, deleteImage };

export const getCollection = async <T extends BaseEntity>(collectionName: string, params?: Record<string, string | number>): Promise<T[]> => {
  try {
    const result = await dbGetCollection<T>(collectionName, params);
    // Sort by createdAt desc locally so that it matches the original orderBy('createdAt', 'desc') behavior
    return result.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  } catch (error) {
    console.error('Error in masterDataService.getCollection:', error);
    return [];
  }
};

export const getDocument = async <T extends BaseEntity>(collectionName: string, id: string): Promise<T | null> => {
  try {
    return await dbGetDocument<T>(collectionName, id);
  } catch (error) {
    console.error('Error in masterDataService.getDocument:', error);
    return null;
  }
};

export const addDocument = async <T extends Omit<BaseEntity, 'id'>>(collectionName: string, data: T): Promise<string> => {
  try {
    return await dbCreateDocument<T>(collectionName, data);
  } catch (error) {
    console.error('Error in masterDataService.addDocument:', error);
    throw error;
  }
};

export const updateDocument = async <T extends Partial<BaseEntity>>(collectionName: string, id: string, data: T): Promise<void> => {
  try {
    return await dbUpdateDocument<T>(collectionName, id, data);
  } catch (error) {
    console.error('Error in masterDataService.updateDocument:', error);
    throw error;
  }
};

export const deleteDocument = async (collectionName: string, id: string): Promise<void> => {
  try {
    return await dbDeleteDocument(collectionName, id);
  } catch (error) {
    console.error('Error in masterDataService.deleteDocument:', error);
    throw error;
  }
};
