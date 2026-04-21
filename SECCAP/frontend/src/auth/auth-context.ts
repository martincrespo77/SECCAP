import { createContext } from 'react';
import type { AuthStatus, AuthUser } from '../types/auth.ts';

export interface AuthContextValue {
  status: AuthStatus;
  user: AuthUser | null;
  token: string | null;
  loginError: string | null;
  sessionNotice: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  clearLoginError: () => void;
  clearSessionNotice: () => void;
  retrySessionCheck: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);