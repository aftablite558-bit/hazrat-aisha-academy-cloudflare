export type UserRole = 'owner' | 'super_admin' | 'admin' | 'principal' | 'teacher' | 'student' | 'parent' | 'user';

export interface UserProfile {
  id?: string; // added back
  uid: string;
  email: string | null;
  role: UserRole;
  displayName: string | null;
  status?: 'active' | 'inactive' | 'suspended' | 'deleted';
  emailVerified?: boolean;
  photoUrl?: string;
  phone?: string;
  username?: string;
}
export * from './enterprise';
