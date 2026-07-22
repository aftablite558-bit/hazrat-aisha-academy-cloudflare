import { api } from '../services/apiClient';

export const logAudit = async (action: string, module: string, user: string, details?: string) => {
  try {
    await api.post('/collection/audit_logs', {
      action,
      module,
      user,
      details: details || '',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Failed to log audit event:', error);
  }
};
