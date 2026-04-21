export interface AuthUser {
  id: number;
  username: string;
  nombre_completo: string;
  email?: string;
  roles: string[];
  permisos: string[];
}

export interface LoginResponse {
  token: string;
  expires_at: string;
  user: AuthUser;
}

export interface SessionUserResponse {
  id: number;
  username: string;
  nombre_completo: string;
  roles: string[];
  permisos: string[];
}

export type AuthStatus = 'checking' | 'authenticated' | 'anonymous' | 'error';