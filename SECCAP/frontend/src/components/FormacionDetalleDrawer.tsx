import { AlertCircle, Download, Loader2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { descargarCertificado, getFormacionDetalle } from '../api/consulta.ts';
import { ApiError } from '../api/http.ts';
import type { FormacionDTO } from '../types/consulta.ts';

interface Props {
  formacionId: number | null;
  onClose: () => void;
}

interface CampoProps {
  label: string;
  value: string | undefined | null;
}

function Campo({ label, value }: CampoProps) {
  if (value === undefined || value === null || value === '') return null;
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="text-sm text-slate-900">{value}</dd>
    </div>
  );
}

function formatearFecha(iso: string | undefined): string | undefined {
  if (!iso) return undefined;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('es-AR', { year: 'numeric', month: '2-digit', day: '2-digit' });
}

function mensajeDeError(err: unknown, fallback: string): string {
  if (err instanceof ApiError) return err.message;
  if (err instanceof Error) return err.message;
  return fallback;
}

export function FormacionDetalleDrawer({ formacionId, onClose }: Props) {
  const [detalle, setDetalle] = useState<FormacionDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const [descargando, setDescargando] = useState(false);
  const [errorDescarga, setErrorDescarga] = useState<string | null>(null);

  useEffect(() => {
    if (formacionId === null) return;

    let cancelado = false;
    setLoading(true);
    setError(null);
    setNotFound(false);
    setDetalle(null);
    setErrorDescarga(null);

    getFormacionDetalle(formacionId)
      .then((res) => {
        if (cancelado) return;
        setDetalle(res);
      })
      .catch((err: unknown) => {
        if (cancelado) return;
        if (err instanceof ApiError && err.status === 404) {
          setNotFound(true);
          return;
        }
        setError(mensajeDeError(err, 'Error al cargar el detalle'));
      })
      .finally(() => {
        if (!cancelado) setLoading(false);
      });

    return () => {
      cancelado = true;
    };
  }, [formacionId]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (formacionId !== null) {
      window.addEventListener('keydown', onKey);
      return () => {
        window.removeEventListener('keydown', onKey);
      };
    }
    return undefined;
  }, [formacionId, onClose]);

  async function handleDescargar() {
    if (!detalle) return;
    setDescargando(true);
    setErrorDescarga(null);
    try {
      const { blob, filename } = await descargarCertificado(detalle.id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        if (err.status === 403) {
          setErrorDescarga('No tenés permiso para descargar este certificado.');
        } else if (err.status === 404) {
          setErrorDescarga('No hay certificado disponible para esta formación.');
        } else {
          setErrorDescarga(err.message);
        }
      } else {
        setErrorDescarga(mensajeDeError(err, 'No se pudo descargar el certificado'));
      }
    } finally {
      setDescargando(false);
    }
  }

  if (formacionId === null) return null;

  const abierto = formacionId !== null;

  return (
    <div
      aria-hidden={!abierto}
      aria-labelledby="detalle-titulo"
      className="fixed inset-0 z-40"
      role="dialog"
    >
      {/* Backdrop */}
      <button
        aria-label="Cerrar detalle"
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition"
        onClick={onClose}
        type="button"
      />

      {/* Panel lateral */}
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-xl flex-col bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900" id="detalle-titulo">
              Detalle de formación
            </h3>
            {detalle && (
              <p className="mt-0.5 text-xs text-slate-500">
                ID #{String(detalle.id)} · {detalle.tipoFormacion}
              </p>
            )}
          </div>
          <button
            aria-label="Cerrar"
            className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100"
            onClick={onClose}
            type="button"
          >
            <X className="size-4" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {loading && (
            <div className="flex items-center gap-2 py-10 text-sm text-slate-500">
              <Loader2 className="size-4 animate-spin" />
              Cargando detalle…
            </div>
          )}

          {!loading && notFound && (
            <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <div>
                <p className="font-medium">Formación no encontrada</p>
                <p className="mt-0.5 text-amber-600">El registro ya no está disponible.</p>
              </div>
            </div>
          )}

          {!loading && error && (
            <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <div>
                <p className="font-medium">No se pudo cargar el detalle</p>
                <p className="mt-0.5 text-red-600">{error}</p>
              </div>
            </div>
          )}

          {!loading && detalle && (
            <div className="space-y-6">
              <section>
                <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Persona
                </h4>
                <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Campo label="Apellido y nombre" value={detalle.apellidoNombre} />
                  <Campo label="Grado" value={detalle.grado} />
                  <Campo label="Unidad" value={detalle.unidad} />
                  <Campo label="DNI" value={detalle.dni} />
                  <Campo label="Legajo" value={detalle.legajo} />
                </dl>
              </section>

              {(detalle.categoriaMilitar ??
                detalle.aptitudCapacitacion ??
                detalle.compromisoServiciosVigente !== undefined) && (
                <section>
                  <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Formación militar
                  </h4>
                  <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Campo label="Categoría militar" value={detalle.categoriaMilitar} />
                    <Campo label="Aptitud / capacitación" value={detalle.aptitudCapacitacion} />
                    {detalle.compromisoServiciosVigente !== undefined && (
                      <Campo
                        label="Compromiso de servicios vigente"
                        value={detalle.compromisoServiciosVigente ? 'Sí' : 'No'}
                      />
                    )}
                  </dl>
                </section>
              )}

              {(detalle.tituloCivil ?? detalle.institucionCivil) && (
                <section>
                  <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Formación civil
                  </h4>
                  <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Campo label="Título civil" value={detalle.tituloCivil} />
                    <Campo label="Institución civil" value={detalle.institucionCivil} />
                  </dl>
                </section>
              )}

              {(detalle.idioma ?? detalle.nivelIdioma ?? detalle.institucion) && (
                <section>
                  <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Idioma
                  </h4>
                  <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Campo label="Idioma" value={detalle.idioma} />
                    <Campo label="Nivel" value={detalle.nivelIdioma} />
                    <Campo label="Institución" value={detalle.institucion} />
                    <Campo label="Tipo de acreditación" value={detalle.tipoAcreditacionIdioma} />
                  </dl>
                </section>
              )}

              <section>
                <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Estado
                </h4>
                <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Campo label="Estado de vigencia" value={detalle.estadoVigencia} />
                  <Campo label="Fecha de obtención" value={formatearFecha(detalle.fechaObtencion)} />
                  <Campo label="Fecha de vencimiento" value={formatearFecha(detalle.fechaVencimiento)} />
                  <Campo
                    label="Tiene documentación"
                    value={detalle.tieneDocumentacion ? 'Sí' : 'No'}
                  />
                  <Campo
                    label="Certificado descargable"
                    value={detalle.certificadoDescargable ? 'Sí' : 'No'}
                  />
                </dl>
              </section>

              {detalle.observaciones && (
                <section>
                  <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Observaciones
                  </h4>
                  <p className="whitespace-pre-line rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                    {detalle.observaciones}
                  </p>
                </section>
              )}
            </div>
          )}
        </div>

        {detalle && (
          <footer className="border-t border-slate-100 px-6 py-4">
            {errorDescarga && (
              <div className="mb-3 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                <AlertCircle className="mt-0.5 size-3.5 shrink-0" />
                <p>{errorDescarga}</p>
              </div>
            )}
            {detalle.certificadoDescargable ? (
              <button
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-900 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_-12px_rgba(30,64,175,0.8)] transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-40"
                disabled={descargando}
                onClick={() => {
                  void handleDescargar();
                }}
                type="button"
              >
                {descargando ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
                {descargando ? 'Descargando…' : 'Descargar certificado'}
              </button>
            ) : (
              <p className="text-center text-xs text-slate-500">
                No hay certificado disponible para esta formación.
              </p>
            )}
          </footer>
        )}
      </aside>
    </div>
  );
}
