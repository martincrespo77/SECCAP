import { FileSearch, LogOut, ShieldCheck } from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth.ts';

export function AppShell() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  async function handleLogout() {
    await logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="min-h-screen bg-transparent text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <header className="rounded-[28px] border border-slate-200/80 bg-white/90 px-5 py-4 shadow-[0_24px_70px_-40px_rgba(15,23,42,0.45)] backdrop-blur lg:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-800">
                SECCAP
              </p>
              <h1 className="mt-1 text-xl font-semibold text-slate-950">
                Sistema de Consulta Segura de Capacidades y Aptitudes del Personal
              </h1>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Sesión activa</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {user?.nombre_completo}
                </p>
                <p className="text-sm text-slate-600">{user?.username}</p>
              </div>

              <button
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-100"
                onClick={() => {
                  void handleLogout();
                }}
                type="button"
              >
                <LogOut className="size-4" />
                Cerrar sesión
              </button>
            </div>
          </div>
        </header>

        <div className="mt-4 grid flex-1 gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="rounded-[28px] border border-slate-200/80 bg-white/88 p-4 shadow-[0_20px_60px_-44px_rgba(15,23,42,0.5)] backdrop-blur">
            <div className="rounded-3xl bg-slate-950 px-4 py-5 text-white">
              <div className="flex items-center gap-3">
                <ShieldCheck className="size-5 text-cyan-300" />
                <div>
                  <p className="text-sm font-semibold">Acceso autenticado</p>
                  <p className="text-xs text-slate-300">Base lista para fases 4.2 y 4.3</p>
                </div>
              </div>
            </div>

            <nav aria-label="Navegación principal" className="mt-5 space-y-2">
              <NavLink
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? 'bg-blue-900 text-white shadow-[0_16px_40px_-28px_rgba(30,64,175,0.9)]'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`
                }
                end
                to="/app"
              >
                <FileSearch className="size-4" />
                Inicio
              </NavLink>
            </nav>
          </aside>

          <main className="rounded-[28px] border border-slate-200/80 bg-white/88 p-5 shadow-[0_20px_60px_-44px_rgba(15,23,42,0.5)] backdrop-blur lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}