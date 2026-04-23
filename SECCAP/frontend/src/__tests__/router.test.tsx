import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

/*
 * Tests del router y shell (Fase 5.2).
 *
 * Verifican que /login renderiza login, que un usuario no autenticado que
 * intenta entrar a /app es redirigido a /login, que un usuario autenticado
 * ve el shell, y que rutas inexistentes muestran el fallback 404.
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
    toApiError: (error: unknown) =>
      error instanceof Error ? new ApiError(error.message) : new ApiError('Error inesperado'),
  };
});

// Evitamos que ConsultaPage dispare carga real de catálogos en este test.
vi.mock('../api/catalogos.ts', () => ({
  getTiposFormacion: vi.fn().mockResolvedValue([]),
  getCategoriasMilitares: vi.fn().mockResolvedValue([]),
  getAptitudes: vi.fn().mockResolvedValue([]),
  getIdiomas: vi.fn().mockResolvedValue([]),
  getNivelesIdioma: vi.fn().mockResolvedValue([]),
  getInstituciones: vi.fn().mockResolvedValue([]),
}));

vi.mock('../api/consulta.ts', () => ({
  ejecutarConsulta: vi.fn(),
  getFormacionDetalle: vi.fn(),
  descargarCertificado: vi.fn(),
}));

import { AuthProvider } from '../auth/AuthContext.tsx';
import { AppRouter } from '../router/AppRouter.tsx';

const sampleUser = {
  id: 7,
  username: 'consultor',
  nombre_completo: 'Consultor de Prueba',
  roles: ['consultor'],
  permisos: ['consulta:leer'],
};

function renderAt(initialPath: string) {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={[initialPath]}>
        <AppRouter />
      </MemoryRouter>
    </AuthProvider>,
  );
}

beforeEach(() => {
  apiMock.get.mockReset();
  apiMock.post.mockReset();
  window.localStorage.clear();
});

describe('Router — sin sesión', () => {
  it('/login renderiza la pantalla de login', async () => {
    renderAt('/login');
    expect(await screen.findByRole('button', { name: /ingresar/i })).toBeInTheDocument();
  });

  it('intentar /app sin sesión redirige a /login', async () => {
    renderAt('/app');
    expect(await screen.findByRole('button', { name: /ingresar/i })).toBeInTheDocument();
  });

  it('ruta inexistente muestra fallback controlado (404)', async () => {
    renderAt('/no-existe');
    expect(await screen.findByText(/error 404/i)).toBeInTheDocument();
    expect(screen.getByText(/la ruta solicitada no existe/i)).toBeInTheDocument();
  });
});

describe('Router — con sesión', () => {
  it('usuario autenticado puede ver el shell principal en /app', async () => {
    window.localStorage.setItem('seccap.auth.token', 'tok-existente');
    apiMock.get.mockResolvedValueOnce({ data: sampleUser });

    renderAt('/app');

    expect(await screen.findByRole('heading', { name: /sistema de consulta segura/i })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: /navegación principal/i })).toBeInTheDocument();
    expect(screen.getAllByText(/consultor de prueba/i).length).toBeGreaterThan(0);
  });
});
