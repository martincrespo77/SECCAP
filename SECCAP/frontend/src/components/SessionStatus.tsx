import { AlertTriangle, LoaderCircle } from 'lucide-react';

interface SessionStatusProps {
  title: string;
  detail: string;
  tone?: 'loading' | 'error';
  actionLabel?: string;
  onAction?: () => void;
}

export function SessionStatus({
  title,
  detail,
  tone = 'loading',
  actionLabel,
  onAction,
}: SessionStatusProps) {
  const isLoading = tone === 'loading';

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-10">
      <div className="w-full max-w-md rounded-3xl border border-slate-200/80 bg-white/90 p-8 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.35)] backdrop-blur">
        <div className="flex items-center gap-3 text-slate-900">
          {isLoading ? (
            <LoaderCircle className="size-6 animate-spin text-blue-700" />
          ) : (
            <AlertTriangle className="size-6 text-amber-600" />
          )}
          <h1 className="text-lg font-semibold">{title}</h1>
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-600">{detail}</p>
        {actionLabel && onAction ? (
          <button
            className="mt-6 inline-flex rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700"
            onClick={onAction}
            type="button"
          >
            {actionLabel}
          </button>
        ) : null}
      </div>
    </div>
  );
}