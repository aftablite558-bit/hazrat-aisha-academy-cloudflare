import { api } from './apiClient';

export const logAction = async (action: string, module: string, userName: string, details?: string) => {
  try {
    await api.post('/collection/audit_logs', {
      action,
      module,
      userName,
      details: details || '',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Failed to log action:', error);
  }
};
