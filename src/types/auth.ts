export interface AuthUser {
  uid: string;
  email: string | null;
  role?: string;
}

export interface AuthService {
  getCurrentUser(): Promise<AuthUser | null>;
  signOut(): Promise<void>;
  // ... other methods
}
