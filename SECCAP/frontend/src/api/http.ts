import axios from 'axios';

const configuredBackendUrl = import.meta.env.VITE_BACKEND_URL?.trim();
const backendUrl = configuredBackendUrl || (import.meta.env.DEV ? '/api' : 'http://localhost:3001');

export const api = axios.create({
  baseURL: backendUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export function setApiToken(token: string | null) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    return;
  }

  delete api.defaults.headers.common.Authorization;
}

export class ApiError extends Error {
  status?: number;
  detail?: unknown;

  constructor(message: string, status?: number, detail?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.detail = detail;
  }
}

export function toApiError(error: unknown) {
  if (axios.isAxiosError(error)) {
    const message =
      typeof error.response?.data?.error === 'string'
        ? error.response.data.error
        : error.message || 'Error de red';

    return new ApiError(message, error.response?.status, error.response?.data?.detalle);
  }

  if (error instanceof Error) {
    return new ApiError(error.message);
  }

  return new ApiError('Ocurrió un error inesperado');
}

export { backendUrl };