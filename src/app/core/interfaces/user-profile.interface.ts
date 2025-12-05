export interface UserProfile {
  uid: string;
  email: string;
  role: 'admin' | 'user' | 'moderator';
  displayName?: string;
}