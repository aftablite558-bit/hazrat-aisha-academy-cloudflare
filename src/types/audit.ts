export interface AuditLog {
  uid: string;
  name?: string;
  role: string;
  action: string;
  collection?: string;
  documentId?: string;
  timestamp: Date;
  device: string;
  browser: string;
  ip?: string;
  status: 'SUCCESS' | 'FAILED';
}
