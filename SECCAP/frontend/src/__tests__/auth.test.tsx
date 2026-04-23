import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, act, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

/*
 * Tests de autenticación (Fase 5.2).
 *
 * Cubren: login exitoso, login fallido, logout, restauración de sesión y
 * que las rutas protegidas redirigen a /login si no hay sesión.
 *
 * Estrategia: se mockea el cliente HTTP (`../api/http.ts`) para no tocar
 * red real ni depender del backend; los demás módulos del frontend siguen
 * siendo los reales.
 */

const { apiMock } = vi.hoisted(() => ({
  apiMock: {
    get: vi.fn(),
    post: vi.fn(),
    defaults: { headers: { common: {} as Record<string, string> } },
  },
}));

vi.mock('../api/http.ts', () => {
  class ApiError extends Error {
    status?: number;
    detail?: unknown;
    constructor(message: string, status?: number, detail?: unknown) {
      super(message);
      this.name = 'ApiError';
      this.status = status;
      this.detail = detail;
    }
  }
  return {
    api: apiMock,
    setApiToken: vi.fn(),
    backendUrl: 'http://localhost:3001',
    ApiError,
    toApiError: (error: unknown) => {
      const maybe = error as { response?: { status?: number; data?: { error?: string; detalle?: unknown } }; message?: string };
      if (maybe && typeof maybe === 'object' && maybe.response) {
        const data = maybe.response.data;
        return new ApiError(data?.error ?? maybe.message ?? 'Error', maybe.response.status, data?.detalle);
      }
      if (error instanceof Error) return new ApiError(error.message);
      return new ApiError('Error inesperado');
    },
  };
});

import { AuthProvider } from '../auth/AuthContext.tsx';
import { LoginPage } from '../pages/LoginPage.tsx';
import { ProtectedRoute } from '../components/ProtectedRoute.tsx';
import { useAuth } from '../auth/useAuth.ts';

function ProtectedSentinel() {
  const { user, logout } = useAuth();
  return (
    <div>
      <p>autenticado:{user?.username}</p>
      <button onClick={() => void logout()} type="button">
        salir
      </button>
    </div>
  );
}

function TestApp() {
  return (
    <AuthProvider>
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route element={<LoginPage />} path="/login" />
          <Route element={<ProtectedRoute />}>
            <Route element={<ProtectedSentinel />} path="/app" />
          </Route>
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  );
}

const sampleUser = {
  id: 7,
  username: 'consultor',
  nombre_completo: 'Consultor de Prueba',
  roles: ['consultor'],
  permisos: ['consulta:leer'],
};

beforeEach(() => {
  apiMock.get.mockReset();
  apiMock.post.mockReset();
  window.localStorage.clear();
});

describe('Auth — login', () => {
  it('login exitoso guarda token en localStorage y habilita sesión', async () => {
    apiMock.post.mockResolvedValueOnce({
      data: {
        token: 'tok-123',
        expires_at: '2099-01-01T00:00:00Z',
        user: sampleUser,
      },
    });

    render(<TestApp />);
    await screen.findByRole('button', { name: /ingresar/i });

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /ingresar/i }));

    await waitFor(() => {
      expect(window.localStorage.getItem('seccap.auth.token')).toBe('tok-123');
    });
    expect(apiMock.post).toHaveBeenCalledWith('/auth/login', expect.objectContaining({
      username: 'consultor',
      password: 'consultor123',
    }));
  });

  it('login fallido (401) muestra mensaje de error y no guarda token', async () => {
    const err = Object.assign(new Error('Request failed'), {
      response: { status: 401, data: { error: 'Credenciales inválidas' } },
    });
    apiMock.post.mockRejectedValueOnce(err);

    render(<TestApp />);
    const btn = await screen.findByRole('button', { name: /ingresar/i });
    fireEvent.submit(btn.closest('form') as HTMLFormElement);

    await waitFor(() => {
      expect(apiMock.post).toHaveBeenCalledWith('/auth/login', expect.any(Object));
    });
    expect(
      await screen.findByText('Usuario o contraseña incorrectos.'),
    ).toBeInTheDocument();
    expect(window.localStorage.getItem('seccap.auth.token')).toBeNull();
    expect(screen.queryByText(/autenticado:/i)).toBeNull();
  });
});

describe('Auth — restauración y logout', () => {
  it('restoreSession con token válido marca al usuario como autenticado', async () => {
    window.localStorage.setItem('seccap.auth.token', 'tok-existente');
    apiMock.get.mockResolvedValueOnce({ data: sampleUser });

    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/app']}>
          <Routes>
            <Route element={<LoginPage />} path="/login" />
            <Route element={<ProtectedRoute />}>
              <Route element={<ProtectedSentinel />} path="/app" />
            </Route>
          </Routes>
        </MemoryRouter>
      </AuthProvider>,
    );

    await screen.findByText(/autenticado:consultor/);
    expect(apiMock.get).toHaveBeenCalledWith('/auth/me');
  });

  it('logout limpia token y devuelve al login', async () => {
    window.localStorage.setItem('seccap.auth.token', 'tok-existente');
    apiMock.get.mockResolvedValueOnce({ data: sampleUser });
    apiMock.post.mockResolvedValueOnce({ data: { ok: true } });

    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/app']}>
          <Routes>
            <Route element={<LoginPage />} path="/login" />
            <Route element={<ProtectedRoute />}>
              <Route element={<ProtectedSentinel />} path="/app" />
            </Route>
          </Routes>
        </MemoryRouter>
      </AuthProvider>,
    );

    await screen.findByText(/autenticado:consultor/);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /salir/i }));

    await screen.findByRole('button', { name: /ingresar/i });
    expect(window.localStorage.getItem('seccap.auth.token')).toBeNull();
    expect(apiMock.post).toHaveBeenCalledWith('/auth/logout');
  });
});

describe('Auth — protección de rutas', () => {
  it('sin token, intentar /app redirige a /login', async () => {
    const tree = render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/app']}>
          <Routes>
            <Route element={<LoginPage />} path="/login" />
            <Route element={<ProtectedRoute />}>
              <Route element={<ProtectedSentinel />} path="/app" />
            </Route>
          </Routes>
        </MemoryRouter>
      </AuthProvider>,
    );

    await tree.findByRole('button', { name: /ingresar/i });
    expect(tree.queryByText(/autenticado:/)).not.toBeInTheDocument();
  });

  it('si /auth/me falla, no autentica y deja sessionNotice', async () => {
    window.localStorage.setItem('seccap.auth.token', 'tok-malo');
    apiMock.get.mockRejectedValueOnce(new Error('boom'));

    await act(async () => {
      render(
        <AuthProvider>
          <MemoryRouter initialEntries={['/app']}>
            <Routes>
              <Route element={<LoginPage />} path="/login" />
              <Route element={<ProtectedRoute />}>
                <Route element={<ProtectedSentinel />} path="/app" />
              </Route>
            </Routes>
          </MemoryRouter>
        </AuthProvider>,
      );
    });

    await screen.findByText(/sesión venció|no pudo validarse/i);
    expect(window.localStorage.getItem('seccap.auth.token')).toBeNull();
  });
});
