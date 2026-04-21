import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/useAuth.ts';
import { SessionStatus } from './SessionStatus.tsx';

export function ProtectedRoute() {
  const location = useLocation();
  const { status, retrySessionCheck } = useAuth();

  if (status === 'checking') {
    return (
      <SessionStatus
        title="Validando sesión"
        detail="Estamos confirmando tus credenciales antes de habilitar el acceso al sistema."
      />
    );
  }

  if (status === 'error') {
    return (
      <SessionStatus
        title="No se pudo cargar la sesión"
        detail="Hubo un problema al restaurar el acceso. Podés reintentar la validación."
        tone="error"
        actionLabel="Reintentar"
        onAction={() => {
          void retrySessionCheck();
        }}
      />
    );
  }

  if (status !== 'authenticated') {
    return <Navigate replace state={{ from: location }} to="/login" />;
  }

  return <Outlet />;
}