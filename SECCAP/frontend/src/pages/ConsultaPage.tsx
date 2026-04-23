import { AlertCircle, ChevronLeft, ChevronRight, Eye, Loader2, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  getAptitudes,
  getCategoriasMilitares,
  getIdiomas,
  getInstituciones,
  getNivelesIdioma,
  getTiposFormacion,
} from '../api/catalogos.ts';
import { ejecutarConsulta } from '../api/consulta.ts';
import type { ApiError } from '../api/http.ts';
import { FormacionDetalleDrawer } from '../components/FormacionDetalleDrawer.tsx';
import type { AptitudItem, CategoriaMilitar, IdiomaItem, InstitucionItem, NivelIdiomaItem, TipoFormacion } from '../types/catalogos.ts';
import type { ConsultaResponse } from '../types/consulta.ts';

const PAGE_SIZE = 5;

// ── helpers ──────────────────────────────────────────────────────────────────

function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  placeholder,
  loading,
  error,
  disabled,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  loading?: boolean;
  error?: string | null;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-slate-700" htmlFor={id}>
        {label}
      </label>
      <div className="relative">
        <select
          className={`w-full appearance-none rounded-2xl border px-4 py-2.5 pr-10 text-sm text-slate-900 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 ${
            error
              ? 'border-red-400 bg-red-50'
              : 'border-slate-300 bg-white hover:border-slate-400'
          }`}
          disabled={disabled ?? loading}
          id={id}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
          }}
        >
          <option value="">{loading ? 'Cargando…' : (placeholder ?? 'Seleccionar')}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {loading && (
          <Loader2 className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-slate-400" />
        )}
      </div>
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-600">
          <AlertCircle className="size-3" />
          {error}
        </p>
      )}
    </div>
  );
}

// ── tipo guardas helpers ──────────────────────────────────────────────────────

function errorMessage(err: unknown): string {
  if (err && typeof (err as ApiError).message === 'string') {
    return (err as ApiError).message;
  }
  return 'Error al cargar';
}

// ── página principal ──────────────────────────────────────────────────────────

export function ConsultaPage() {
  // Catálogos estáticos (cargan una vez)
  const [tipos, setTipos] = useState<TipoFormacion[]>([]);
  const [categorias, setCategorias] = useState<CategoriaMilitar[]>([]);
  const [idiomas, setIdiomas] = useState<IdiomaItem[]>([]);
  const [nivelesIdioma, setNivelesIdioma] = useState<NivelIdiomaItem[]>([]);

  const [loadingTipos, setLoadingTipos] = useState(true);
  const [loadingCategorias, setLoadingCategorias] = useState(false);
  const [loadingIdiomas, setLoadingIdiomas] = useState(false);
  const [loadingNiveles, setLoadingNiveles] = useState(false);

  const [errorTipos, setErrorTipos] = useState<string | null>(null);
  const [errorCategorias, setErrorCategorias] = useState<string | null>(null);
  const [errorIdiomas, setErrorIdiomas] = useState<string | null>(null);
  const [errorNiveles, setErrorNiveles] = useState<string | null>(null);

  // Catálogos dependientes (re-cargan según selección)
  const [aptitudes, setAptitudes] = useState<AptitudItem[]>([]);
  const [instituciones, setInstituciones] = useState<InstitucionItem[]>([]);

  const [loadingAptitudes, setLoadingAptitudes] = useState(false);
  const [loadingInstituciones, setLoadingInstituciones] = useState(false);

  const [errorAptitudes, setErrorAptitudes] = useState<string | null>(null);
  const [errorInstituciones, setErrorInstituciones] = useState<string | null>(null);

  // Valores de filtros
  const [tipoFormacion, setTipoFormacion] = useState('');
  const [categoriaMilitar, setCategoriaMilitar] = useState('');
  const [aptitud, setAptitud] = useState('');
  const [idioma, setIdioma] = useState('');
  const [nivelIdioma, setNivelIdioma] = useState('');
  const [institucion, setInstitucion] = useState('');

  // Resultado de consulta
  const [resultado, setResultado] = useState<ConsultaResponse | null>(null);
  const [loadingConsulta, setLoadingConsulta] = useState(false);
  const [errorConsulta, setErrorConsulta] = useState<string | null>(null);

  // Detalle
  const [detalleId, setDetalleId] = useState<number | null>(null);

  // Carga inicial: tipos, categorías, idiomas y niveles (no dependen de selección)
  useEffect(() => {
    setLoadingTipos(true);
    getTiposFormacion()
      .then(setTipos)
      .catch((err: unknown) => {
        setErrorTipos(errorMessage(err));
      })
      .finally(() => {
        setLoadingTipos(false);
      });

    setLoadingCategorias(true);
    getCategoriasMilitares()
      .then(setCategorias)
      .catch((err: unknown) => {
        setErrorCategorias(errorMessage(err));
      })
      .finally(() => {
        setLoadingCategorias(false);
      });

    setLoadingIdiomas(true);
    getIdiomas()
      .then(setIdiomas)
      .catch((err: unknown) => {
        setErrorIdiomas(errorMessage(err));
      })
      .finally(() => {
        setLoadingIdiomas(false);
      });

    setLoadingNiveles(true);
    getNivelesIdioma()
      .then(setNivelesIdioma)
      .catch((err: unknown) => {
        setErrorNiveles(errorMessage(err));
      })
      .finally(() => {
        setLoadingNiveles(false);
      });
  }, []);

  function resetResultado() {
    setResultado(null);
    setErrorConsulta(null);
  }

  // Al cambiar tipo_formacion: limpiar filtros dependientes y resultado
  function handleTipoChange(valor: string) {
    setTipoFormacion(valor);
    setCategoriaMilitar('');
    setAptitud('');
    setAptitudes([]);
    setErrorAptitudes(null);
    setIdioma('');
    setNivelIdioma('');
    setInstitucion('');
    setInstituciones([]);
    setErrorInstituciones(null);
    resetResultado();
  }

  // Al cambiar categoría militar: re-cargar aptitudes
  function handleCategoriaChange(valor: string) {
    setCategoriaMilitar(valor);
    setAptitud('');
    setAptitudes([]);
    setErrorAptitudes(null);
    resetResultado();

    if (!valor) return;

    setLoadingAptitudes(true);
    getAptitudes(valor)
      .then(setAptitudes)
      .catch((err: unknown) => {
        setErrorAptitudes(errorMessage(err));
      })
      .finally(() => {
        setLoadingAptitudes(false);
      });
  }

  // Al cambiar idioma: re-cargar instituciones
  function handleIdiomaChange(valor: string) {
    setIdioma(valor);
    setInstitucion('');
    setInstituciones([]);
    setErrorInstituciones(null);
    resetResultado();

    if (!valor) return;

    setLoadingInstituciones(true);
    getInstituciones(valor)
      .then(setInstituciones)
      .catch((err: unknown) => {
        setErrorInstituciones(errorMessage(err));
      })
      .finally(() => {
        setLoadingInstituciones(false);
      });
  }

  async function ejecutar(paginaObjetivo: number) {
    if (!tipoFormacion) return;

    setLoadingConsulta(true);
    setErrorConsulta(null);

    try {
      const res = await ejecutarConsulta({
        tipo_formacion: tipoFormacion,
        ...(tipoFormacion === 'militar' && categoriaMilitar ? { categoria_militar: categoriaMilitar } : {}),
        ...(tipoFormacion === 'militar' && aptitud ? { aptitud_capacitacion: aptitud } : {}),
        ...(tipoFormacion === 'idioma' && idioma ? { idioma } : {}),
        ...(tipoFormacion === 'idioma' && nivelIdioma ? { nivel_idioma: nivelIdioma } : {}),
        ...(tipoFormacion === 'idioma' && institucion ? { institucion } : {}),
        page: paginaObjetivo,
        page_size: PAGE_SIZE,
      });
      setResultado(res);
    } catch (err: unknown) {
      setResultado(null);
      setErrorConsulta(errorMessage(err));
    } finally {
      setLoadingConsulta(false);
    }
  }

  // Disparo de consulta (nueva búsqueda -> vuelve a página 1)
  async function handleBuscar(e: React.FormEvent) {
    e.preventDefault();
    await ejecutar(1);
  }

  async function handleIrPagina(nueva: number) {
    await ejecutar(nueva);
  }

  const tiposOptions = tipos.map((t) => ({ value: t.codigo, label: t.nombre }));
  const categoriasOptions = categorias.map((c) => ({ value: c.codigo, label: c.nombre }));
  const aptitudesOptions = aptitudes.map((a) => ({ value: a.nombre, label: a.nombre }));
  const idiomasOptions = idiomas.map((i) => ({ value: i.nombre, label: i.nombre }));
  const nivelesOptions = nivelesIdioma.map((n) => ({ value: n.codigo, label: n.nombre }));
  const institucionesOptions = instituciones.map((i) => ({ value: i.nombre, label: i.nombre }));

  const puedeBuscar = Boolean(tipoFormacion) && !loadingConsulta;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Consulta de Formación</h2>
        <p className="mt-1 text-sm text-slate-500">
          Seleccioná el tipo de formación y completá los filtros para realizar la consulta.
        </p>
      </div>

      <form
        className="rounded-[24px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.4)] backdrop-blur"
        onSubmit={(e) => {
          void handleBuscar(e);
        }}
      >
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* Filtro raíz */}
          <div className="sm:col-span-2 lg:col-span-3">
            <SelectField
              id="tipo_formacion"
              label="Tipo de formación *"
              loading={loadingTipos}
              error={errorTipos}
              options={tiposOptions}
              placeholder="— Seleccionar tipo —"
              value={tipoFormacion}
              onChange={handleTipoChange}
            />
          </div>

          {/* Filtros militares */}
          {tipoFormacion === 'militar' && (
            <>
              <SelectField
                id="categoria_militar"
                label="Categoría militar"
                loading={loadingCategorias}
                error={errorCategorias}
                options={categoriasOptions}
                placeholder="Todas las categorías"
                value={categoriaMilitar}
                onChange={handleCategoriaChange}
              />
              <SelectField
                id="aptitud_capacitacion"
                label="Aptitud / capacitación"
                disabled={!categoriaMilitar}
                loading={loadingAptitudes}
                error={errorAptitudes}
                options={aptitudesOptions}
                placeholder={!categoriaMilitar ? 'Elegir categoría primero' : 'Todas las aptitudes'}
                value={aptitud}
                onChange={(v) => {
                  setAptitud(v);
                  resetResultado();
                }}
              />
            </>
          )}

          {/* Filtros idioma */}
          {tipoFormacion === 'idioma' && (
            <>
              <SelectField
                id="idioma"
                label="Idioma"
                loading={loadingIdiomas}
                error={errorIdiomas}
                options={idiomasOptions}
                placeholder="Todos los idiomas"
                value={idioma}
                onChange={handleIdiomaChange}
              />
              <SelectField
                id="nivel_idioma"
                label="Nivel"
                loading={loadingNiveles}
                error={errorNiveles}
                options={nivelesOptions}
                placeholder="Todos los niveles"
                value={nivelIdioma}
                onChange={(v) => {
                  setNivelIdioma(v);
                  resetResultado();
                }}
              />
              <SelectField
                id="institucion"
                label="Institución"
                disabled={!idioma}
                loading={loadingInstituciones}
                error={errorInstituciones}
                options={institucionesOptions}
                placeholder={!idioma ? 'Elegir idioma primero' : 'Todas las instituciones'}
                value={institucion}
                onChange={(v) => {
                  setInstitucion(v);
                  resetResultado();
                }}
              />
            </>
          )}

          {/* Formación civil: no hay catálogos específicos aprobados en backend */}
          {tipoFormacion === 'civil' && (
            <div className="flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 sm:col-span-2 lg:col-span-3">
              <AlertCircle className="size-4 shrink-0" />
              La formación civil no expone filtros adicionales; la consulta devuelve todos los registros disponibles.
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            {tipoFormacion === '' && 'Seleccioná un tipo de formación para habilitar la búsqueda.'}
            {tipoFormacion === 'militar' && !categoriaMilitar && 'Podés buscar sin categoría o elegir una para filtrar aptitudes.'}
          </p>
          <button
            className="inline-flex items-center gap-2 rounded-full bg-blue-900 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_-12px_rgba(30,64,175,0.8)] transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-40"
            disabled={!puedeBuscar}
            type="submit"
          >
            {loadingConsulta ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Search className="size-4" />
            )}
            {loadingConsulta ? 'Buscando…' : 'Buscar'}
          </button>
        </div>
      </form>

      {/* Error de consulta */}
      {errorConsulta && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <div>
            <p className="font-medium">No se pudo realizar la consulta</p>
            <p className="mt-0.5 text-red-600">{errorConsulta}</p>
          </div>
        </div>
      )}

      {/* Resultados */}
      {resultado && (
        <div className="rounded-[24px] border border-slate-200/80 bg-white/90 shadow-[0_16px_50px_-36px_rgba(15,23,42,0.4)] backdrop-blur">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <h3 className="text-sm font-semibold text-slate-900">Resultados</h3>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              {resultado.total} registro{resultado.total !== 1 ? 's' : ''} encontrado{resultado.total !== 1 ? 's' : ''}
            </span>
          </div>

          {resultado.items.length === 0 ? (
            <div className="px-6 py-10 text-center text-sm text-slate-500">
              No se encontraron registros con los filtros seleccionados.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <th className="px-6 py-3">Apellido y nombre</th>
                    <th className="px-6 py-3">Grado</th>
                    <th className="px-6 py-3">Unidad</th>
                    <th className="px-6 py-3">Tipo</th>
                    <th className="px-6 py-3">Estado</th>
                    <th className="px-6 py-3">Detalle</th>
                    <th className="px-6 py-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {resultado.items.map((item) => (
                    <tr className="hover:bg-slate-50/60" key={item.id}>
                      <td className="px-6 py-3 font-medium text-slate-900">{item.apellidoNombre}</td>
                      <td className="px-6 py-3 text-slate-600">{item.grado}</td>
                      <td className="px-6 py-3 text-slate-600">{item.unidad}</td>
                      <td className="px-6 py-3">
                        <span className="inline-block rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 capitalize">
                          {item.tipoFormacion}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            item.estadoVigencia === 'vigente'
                              ? 'bg-green-50 text-green-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {item.estadoVigencia}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-slate-500">
                        {item.tipoFormacion === 'militar' && (
                          <span>
                            {item.categoriaMilitar ?? '—'}
                            {item.aptitudCapacitacion ? ` · ${item.aptitudCapacitacion}` : ''}
                          </span>
                        )}
                        {item.tipoFormacion === 'idioma' && (
                          <span>
                            {item.idioma ?? '—'}
                            {item.nivelIdioma ? ` · ${item.nivelIdioma}` : ''}
                          </span>
                        )}
                        {item.tipoFormacion === 'civil' && (
                          <span>{item.tituloCivil ?? '—'}</span>
                        )}
                      </td>
                      <td className="px-6 py-3 text-right">
                        <button
                          aria-label={`Ver detalle de ${item.apellidoNombre}`}
                          className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                          onClick={() => {
                            setDetalleId(item.id);
                          }}
                          type="button"
                        >
                          <Eye className="size-3.5" />
                          Ver
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {resultado.total > 0 && (() => {
            const totalPaginas = Math.max(1, Math.ceil(resultado.total / resultado.pageSize));
            const inicio = (resultado.page - 1) * resultado.pageSize + 1;
            const fin = Math.min(resultado.page * resultado.pageSize, resultado.total);
            const puedeAnterior = resultado.page > 1 && !loadingConsulta;
            const puedeSiguiente = resultado.page < totalPaginas && !loadingConsulta;

            return (
              <div className="flex flex-col gap-3 border-t border-slate-100 px-6 py-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                <span>
                  Mostrando {inicio}–{fin} de {resultado.total} · Página {resultado.page} de {totalPaginas}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    aria-label="Página anterior"
                    className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 transition hover:border-blue-300 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
                    disabled={!puedeAnterior}
                    onClick={() => {
                      void handleIrPagina(resultado.page - 1);
                    }}
                    type="button"
                  >
                    <ChevronLeft className="size-3.5" />
                    Anterior
                  </button>
                  <button
                    aria-label="Página siguiente"
                    className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 transition hover:border-blue-300 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
                    disabled={!puedeSiguiente}
                    onClick={() => {
                      void handleIrPagina(resultado.page + 1);
                    }}
                    type="button"
                  >
                    Siguiente
                    <ChevronRight className="size-3.5" />
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      <FormacionDetalleDrawer
        formacionId={detalleId}
        onClose={() => {
          setDetalleId(null);
        }}
      />
    </div>
  );
}
