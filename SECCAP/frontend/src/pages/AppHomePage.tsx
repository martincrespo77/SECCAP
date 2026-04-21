import { ShieldCheck, UserCog } from 'lucide-react';
import { useAuth } from '../auth/useAuth.ts';

export function AppHomePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <section className="rounded-[28px] border border-slate-200 bg-slate-50 px-5 py-6 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-800">Fase 4.1</p>
        <h2 className="mt-3 text-2xl font-semibold text-slate-950">Shell autenticado operativo</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
          La autenticación, la restauración de sesión y el resguardo de rutas ya están activos.
          Las pantallas de filtros, resultados y detalle quedan reservadas para las siguientes subfases.
        </p>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_-44px_rgba(15,23,42,0.5)] sm:p-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="size-5 text-blue-800" />
            <h3 className="text-lg font-semibold text-slate-900">Estado del módulo</h3>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Login</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">Conectado al backend real</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Rutas</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">Protección aplicada</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Sesión</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">Restaurable y revocable</p>
            </div>
          </div>
        </article>

        <article className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_-44px_rgba(15,23,42,0.5)] sm:p-6">
          <div className="flex items-center gap-3">
            <UserCog className="size-5 text-blue-800" />
            <h3 className="text-lg font-semibold text-slate-900">Usuario autenticado</h3>
          </div>
          <dl className="mt-5 space-y-4 text-sm text-slate-600">
            <div>
              <dt className="text-xs uppercase tracking-[0.2em] text-slate-500">Nombre</dt>
              <dd className="mt-1 text-base font-semibold text-slate-900">{user?.nombre_completo}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.2em] text-slate-500">Usuario</dt>
              <dd className="mt-1">{user?.username}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.2em] text-slate-500">Roles</dt>
              <dd className="mt-2 flex flex-wrap gap-2">
                {user?.roles.map((role) => (
                  <span
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700"
                    key={role}
                  >
                    {role}
                  </span>
                ))}
              </dd>
            </div>
          </dl>
        </article>
      </section>
    </div>
  );
}