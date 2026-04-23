import { ApiError, api, toApiError } from './http.ts';
import type { ConsultaResponse, FiltrosConsulta, FormacionDTO } from '../types/consulta.ts';

export async function ejecutarConsulta(filtros: FiltrosConsulta): Promise<ConsultaResponse> {
  try {
    const params: Record<string, string> = {
      tipo_formacion: filtros.tipo_formacion,
    };
    if (filtros.categoria_militar) params.categoria_militar = filtros.categoria_militar;
    if (filtros.aptitud_capacitacion) params.aptitud_capacitacion = filtros.aptitud_capacitacion;
    if (filtros.idioma) params.idioma = filtros.idioma;
    if (filtros.nivel_idioma) params.nivel_idioma = filtros.nivel_idioma;
    if (filtros.institucion) params.institucion = filtros.institucion;
    if (filtros.page) params.page = String(filtros.page);
    if (filtros.page_size) params.page_size = String(filtros.page_size);

    const res = await api.get<ConsultaResponse>('/formacion/consulta', { params });
    return res.data;
  } catch (err) {
    throw toApiError(err);
  }
}

export async function getFormacionDetalle(id: number): Promise<FormacionDTO> {
  try {
    const res = await api.get<FormacionDTO>(`/formacion/${String(id)}`);
    return res.data;
  } catch (err) {
    throw toApiError(err);
  }
}

export interface CertificadoDescarga {
  blob: Blob;
  filename: string;
}

function extraerFilename(contentDisposition: string | null, fallback: string): string {
  if (!contentDisposition) return fallback;
  const utf8Match = /filename\*=(?:UTF-8'')?([^;]+)/i.exec(contentDisposition);
  if (utf8Match?.[1]) {
    const raw = utf8Match[1].replace(/^"|"$/g, '').trim();
    try {
      return decodeURIComponent(raw);
    } catch {
      return raw;
    }
  }
  const match = /filename="?([^";]+)"?/i.exec(contentDisposition);
  if (match?.[1]) return match[1].trim();
  return fallback;
}

export async function descargarCertificado(id: number): Promise<CertificadoDescarga> {
  try {
    const res = await api.get<Blob>(`/formacion/${String(id)}/certificado`, {
      responseType: 'blob',
    });
    const headers = res.headers as Record<string, string | undefined>;
    const contentDisposition = headers['content-disposition'] ?? headers['Content-Disposition'] ?? null;
    const filename = extraerFilename(contentDisposition, `certificado-${String(id)}.pdf`);
    return { blob: res.data, filename };
  } catch (err) {
    // Si el backend devolvió JSON de error pero responseType era blob, lo decodificamos.
    const maybeAxios = err as { isAxiosError?: boolean; response?: { data?: unknown; status?: number } };
    if (maybeAxios.isAxiosError && maybeAxios.response?.data instanceof Blob) {
      const { data, status } = maybeAxios.response;
      try {
        const texto = await data.text();
        const parsed = JSON.parse(texto) as { error?: string; detalle?: unknown };
        throw new ApiError(parsed.error ?? 'Error al descargar certificado', status, parsed.detalle);
      } catch (innerErr) {
        if (innerErr instanceof ApiError) throw innerErr;
        // Si no se pudo parsear, caer al manejo genérico.
      }
    }
    throw toApiError(err);
  }
}
