import { useEffect, useState, type FormEvent } from 'react';
import { LockKeyhole, Shield, UserRound } from 'lucide-react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { backendUrl } from '../api/http.ts';
import { useAuth } from '../auth/useAuth.ts';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    clearLoginError,
    clearSessionNotice,
    login,
    loginError,
    sessionNotice,
    status,
  } = useAuth();
  const [username, setUsername] = useState('consultor');
  const [password, setPassword] = useState('consultor123');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    return () => {
      clearLoginError();
    };
  }, [clearLoginError]);

  if (status === 'authenticated') {
    const next = location.state?.from?.pathname || '/app';
    return <Navigate replace to={next} />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    const ok = await login(username.trim(), password);
    setSubmitting(false);

    if (ok) {
      const next = location.state?.from?.pathname || '/app';
      navigate(next, { replace: true });
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[32px] border border-slate-200/80 bg-white/92 shadow-[0_40px_120px_-56px_rgba(15,23,42,0.5)] backdrop-blur lg:grid-cols-[1.1fr_0.9fr]">
        <section className="relative overflow-hidden bg-slate-950 px-6 py-8 text-white sm:px-8 lg:px-10 lg:py-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_30%),linear-gradient(145deg,_rgba(15,23,42,1)_0%,_rgba(12,18,32,0.98)_55%,_rgba(18,31,54,0.98)_100%)]" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
              Acceso seguro
            </p>
            <h1 className="mt-4 max-w-md text-3xl font-semibold leading-tight text-white sm:text-4xl">
              Shell inicial del frontend SECCAP con autenticación operativa.
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-7 text-slate-300 sm:text-base">
              Esta base habilita sesión restaurable, rutas protegidas, logout real y un punto de entrada
              estable para las siguientes fases del módulo de consulta.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-white/6 p-4">
                <div className="flex items-center gap-3">
                  <Shield className="size-5 text-cyan-300" />
                  <p className="text-sm font-medium">Sesión controlada</p>
                </div>
                <p className="mt-3 text-sm text-slate-300">
                  El token se conserva localmente y se revalida con /auth/me al iniciar.
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/6 p-4">
                <div className="flex items-center gap-3">
                  <LockKeyhole className="size-5 text-cyan-300" />
                  <p className="text-sm font-medium">Backend esperado</p>
                </div>
                <p className="mt-3 text-sm text-slate-300 break-all">{backendUrl}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
          <div className="max-w-md">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-800">Ingreso</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">Iniciar sesión</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Usá una cuenta habilitada para acceder al shell autenticado del sistema.
            </p>

            {sessionNotice ? (
              <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                <div className="flex items-start justify-between gap-4">
                  <span>{sessionNotice}</span>
                  <button
                    className="shrink-0 text-xs font-semibold uppercase tracking-[0.18em] text-amber-700"
                    onClick={clearSessionNotice}
                    type="button"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            ) : null}

            {loginError ? (
              <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {loginError}
              </div>
            ) : null}

            <form className="mt-8 space-y-5" onSubmit={(event) => void handleSubmit(event)}>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Usuario</span>
                <span className="flex items-center rounded-2xl border border-slate-300 bg-white px-4 py-3 shadow-sm transition focus-within:border-blue-700 focus-within:ring-2 focus-within:ring-blue-200">
                  <UserRound className="mr-3 size-4 text-slate-400" />
                  <input
                    autoComplete="username"
                    className="w-full border-none bg-transparent text-slate-900 outline-none placeholder:text-slate-400"
                    onChange={(event) => setUsername(event.target.value)}
                    placeholder="Ingresá tu usuario"
                    type="text"
                    value={username}
                  />
                </span>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Contraseña</span>
                <span className="flex items-center rounded-2xl border border-slate-300 bg-white px-4 py-3 shadow-sm transition focus-within:border-blue-700 focus-within:ring-2 focus-within:ring-blue-200">
                  <LockKeyhole className="mr-3 size-4 text-slate-400" />
                  <input
                    autoComplete="current-password"
                    className="w-full border-none bg-transparent text-slate-900 outline-none placeholder:text-slate-400"
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Ingresá tu contraseña"
                    type="password"
                    value={password}
                  />
                </span>
              </label>

              <button
                className="inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:bg-slate-400"
                disabled={submitting}
                type="submit"
              >
                {submitting ? 'Validando credenciales...' : 'Ingresar'}
              </button>
            </form>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              Cuenta de prueba sugerida: <strong>consultor / consultor123</strong>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}