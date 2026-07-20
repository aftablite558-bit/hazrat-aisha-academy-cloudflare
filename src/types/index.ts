export type UserRole = 'super_admin' | 'admin' | 'principal' | 'teacher' | 'student' | 'parent';

export interface UserProfile {
  uid: string;
  email: string | null;
  role: UserRole;
  displayName: string | null;
  status?: 'active' | 'inactive' | 'suspended' | 'deleted';
  emailVerified?: boolean;
}
export * from './enterprise';
