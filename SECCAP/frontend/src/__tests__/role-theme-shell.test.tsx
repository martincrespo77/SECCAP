import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

/*
 * Tests de diferenciación visual por rol en el shell autenticado y en la
 * Home. Verifican que, una vez restaurada la sesión, el badge de rol y la
 * tarjeta lateral reflejen el rol visual efectivo con su precedencia.
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

function userWith(roles: string[]) {
  return {
    id: 1,
    username: 'u',
    nombre_completo: 'Usuario de Prueba',
    roles,
    permisos: ['consulta:leer'],
  };
}

function renderAppAt(initialPath: string) {
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
  window.localStorage.setItem('seccap.auth.token', 'tok');
});

describe('Shell autenticado — tema visual por rol', () => {
  it('rol consultor muestra badge de Consultor', async () => {
    apiMock.get.mockResolvedValueOnce({ data: userWith(['consultor']) });

    renderAppAt('/app');

    const badge = await screen.findByTestId('role-badge');
    expect(badge).toHaveAttribute('data-role', 'consultor');
    expect(badge.textContent?.toLowerCase()).toContain('consultor');
  });

  it('rol auditor muestra badge de Auditor', async () => {
    apiMock.get.mockResolvedValueOnce({ data: userWith(['auditor']) });

    renderAppAt('/app');

    const badge = await screen.findByTestId('role-badge');
    expect(badge).toHaveAttribute('data-role', 'auditor');
    expect(badge.textContent?.toLowerCase()).toContain('auditor');
  });

  it('rol admin muestra badge de Administrador', async () => {
    apiMock.get.mockResolvedValueOnce({ data: userWith(['admin']) });

    renderAppAt('/app');

    const badge = await screen.findByTestId('role-badge');
    expect(badge).toHaveAttribute('data-role', 'admin');
    expect(badge.textContent?.toLowerCase()).toContain('admin');
  });

  it('con múltiples roles gana precedencia admin > auditor > consultor', async () => {
    apiMock.get.mockResolvedValueOnce({
      data: userWith(['consultor', 'auditor', 'admin']),
    });

    renderAppAt('/app');

    const badge = await screen.findByTestId('role-badge');
    expect(badge).toHaveAttribute('data-role', 'admin');
  });

  it('auditor + consultor → gana auditor en el shell', async () => {
    apiMock.get.mockResolvedValueOnce({
      data: userWith(['consultor', 'auditor']),
    });

    renderAppAt('/app');

    const badge = await screen.findByTestId('role-badge');
    expect(badge).toHaveAttribute('data-role', 'auditor');
  });

  it('Home autenticada también expone el badge de rol activo', async () => {
    apiMock.get.mockResolvedValueOnce({ data: userWith(['auditor']) });

    renderAppAt('/app');

    const homeBadge = await screen.findByTestId('home-role-badge');
    expect(homeBadge).toHaveAttribute('data-role', 'auditor');
  });
});
