import { ArrowLeft, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/useAuth.ts';

export function NotFoundPage() {
  const { status } = useAuth();
  const target = status === 'authenticated' ? '/app' : '/login';
  const label = status === 'authenticated' ? 'Volver al panel' : 'Ir al login';

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-10">
      <div className="w-full max-w-xl rounded-[32px] border border-slate-200/80 bg-white/92 p-8 text-center shadow-[0_32px_100px_-52px_rgba(15,23,42,0.45)] backdrop-blur sm:p-10">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-slate-950 text-white">
          <Compass className="size-7" />
        </div>
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.28em] text-blue-800">Error 404</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-950">La ruta solicitada no existe.</h1>
        <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
          El shell inicial solo expone las rutas mínimas de autenticación y acceso protegido definidas
          para la fase 4.1.
        </p>
        <Link
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-900"
          to={target}
        >
          <ArrowLeft className="size-4" />
          {label}
        </Link>
      </div>
    </div>
  );
}