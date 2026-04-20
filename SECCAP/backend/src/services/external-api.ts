import { config } from '../config.js';
import { logger } from '../logger.js';

/**
 * Cliente HTTP para consumir la API externa (mock o real).
 * Anti-Corruption Layer: aísla al backend proxy del transporte
 * y manejo de errores de la API del Área de Personal.
 */

const TIMEOUT_MS = 10_000;

export class ExternalApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly upstream?: unknown,
  ) {
    super(message);
    this.name = 'ExternalApiError';
  }
}

export async function fetchExterna<T>(path: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(path, config.MOCK_API_URL);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== '') {
        url.searchParams.set(k, v);
      }
    }
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(url.toString(), {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' },
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      logger.warn({ url: url.toString(), status: res.status, body }, 'API externa respondió con error');
      throw new ExternalApiError(
        `API externa respondió ${res.status}`,
        res.status,
        body,
      );
    }

    return (await res.json()) as T;
  } catch (err) {
    if (err instanceof ExternalApiError) throw err;

    if (err instanceof DOMException && err.name === 'AbortError') {
      logger.error({ url: url.toString() }, 'Timeout al conectar con API externa');
      throw new ExternalApiError('Timeout al conectar con API externa', 504);
    }

    logger.error({ url: url.toString(), err }, 'Error de conexión con API externa');
    throw new ExternalApiError('No se pudo conectar con la API externa', 502);
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Realiza una petición GET a la API externa y devuelve la Response cruda.
 * Útil para proxy de archivos binarios (certificados).
 * El llamador es responsable de consumir el body.
 */
export async function fetchExternaRaw(path: string): Promise<Response> {
  const url = new URL(path, config.MOCK_API_URL);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(url.toString(), { signal: controller.signal });

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      logger.warn({ url: url.toString(), status: res.status, body }, 'API externa respondió con error (raw)');
      throw new ExternalApiError(
        `API externa respondió ${res.status}`,
        res.status,
        body,
      );
    }

    return res;
  } catch (err) {
    if (err instanceof ExternalApiError) throw err;

    if (err instanceof DOMException && err.name === 'AbortError') {
      logger.error({ url: url.toString() }, 'Timeout al conectar con API externa (raw)');
      throw new ExternalApiError('Timeout al conectar con API externa', 504);
    }

    logger.error({ url: url.toString(), err }, 'Error de conexión con API externa (raw)');
    throw new ExternalApiError('No se pudo conectar con la API externa', 502);
  } finally {
    clearTimeout(timer);
  }
}
