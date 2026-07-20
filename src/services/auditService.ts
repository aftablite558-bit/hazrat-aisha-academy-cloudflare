import { db } from '../firebase/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { AuditLog } from '../types/audit';

export const logAction = async (logData: Omit<AuditLog, 'timestamp'>) => {
  try {
    await addDoc(collection(db, 'audit_logs'), {
      ...logData,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error('Failed to log action:', error);
  }
};
