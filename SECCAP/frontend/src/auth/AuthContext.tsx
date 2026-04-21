import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { api, setApiToken, toApiError } from '../api/http.ts';
import { clearStoredToken, readStoredToken, writeStoredToken } from './auth-storage.ts';
import { AuthContext, type AuthContextValue } from './auth-context.ts';
import type {
  AuthStatus,
  AuthUser,
  LoginResponse,
  SessionUserResponse,
} from '../types/auth.ts';

function mapLoginError(error: unknown) {
  const apiError = toApiError(error);

  if (apiError.status === 400) {
    return 'Completá usuario y contraseña para iniciar sesión.';
  }

  if (apiError.status === 401) {
    return 'Usuario o contraseña incorrectos.';
  }

  if (apiError.status === 403) {
    if (typeof apiError.detail === 'string' && apiError.detail.length > 0) {
      return apiError.detail;
    }

    return 'La cuenta no puede iniciar sesión en este momento.';
  }

  return 'No se pudo iniciar sesión. Verificá la conexión e intentá nuevamente.';
}

function buildUserFromSession(data: SessionUserResponse, fallbackEmail?: string) {
  return {
    ...data,
    email: fallbackEmail,
  } satisfies AuthUser;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('checking');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [sessionNotice, setSessionNotice] = useState<string | null>(null);
  const rememberedUser = useRef<AuthUser | null>(null);

  async function restoreSession() {
    const storedToken = readStoredToken();
    if (!storedToken) {
      setApiToken(null);
      setToken(null);
      setUser(null);
      setStatus('anonymous');
      return;
    }

    try {
      setStatus('checking');
      setApiToken(storedToken);
      const response = await api.get<SessionUserResponse>('/auth/me');
      setToken(storedToken);
      setUser(buildUserFromSession(response.data, rememberedUser.current?.email));
      setStatus('authenticated');
    } catch {
      clearStoredToken();
      setApiToken(null);
      setToken(null);
      setUser(null);
      setSessionNotice('La sesión venció o no pudo validarse. Iniciá sesión nuevamente.');
      setStatus('anonymous');
    }
  }

  useEffect(() => {
    void restoreSession();
  }, []);

  async function login(username: string, password: string) {
    setLoginError(null);

    try {
      const response = await api.post<LoginResponse>('/auth/login', {
        username,
        password,
      });

      const nextToken = response.data.token;
      const nextUser = response.data.user;

      rememberedUser.current = nextUser;
      writeStoredToken(nextToken);
      setApiToken(nextToken);
      setToken(nextToken);
      setUser(nextUser);
      setSessionNotice(null);
      setStatus('authenticated');
      return true;
    } catch (error) {
      setLoginError(mapLoginError(error));
      setStatus('anonymous');
      return false;
    }
  }

  async function logout() {
    try {
      if (token) {
        await api.post('/auth/logout');
      }
    } catch {
      // No bloquear el cierre local de sesión si el backend ya no responde.
    } finally {
      rememberedUser.current = null;
      clearStoredToken();
      setApiToken(null);
      setToken(null);
      setUser(null);
      setLoginError(null);
      setStatus('anonymous');
    }
  }

  const value: AuthContextValue = {
    status,
    user,
    token,
    loginError,
    sessionNotice,
    login,
    logout,
    clearLoginError: () => setLoginError(null),
    clearSessionNotice: () => setSessionNotice(null),
    retrySessionCheck: restoreSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}