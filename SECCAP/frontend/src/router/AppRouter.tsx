import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '../components/ProtectedRoute.tsx';
import { useAuth } from '../auth/useAuth.ts';
import { AppShell } from '../layout/AppShell.tsx';
import { AppHomePage } from '../pages/AppHomePage.tsx';
import { ConsultaPage } from '../pages/ConsultaPage.tsx';
import { LoginPage } from '../pages/LoginPage.tsx';
import { NotFoundPage } from '../pages/NotFoundPage.tsx';

function RootRedirect() {
  const { status } = useAuth();

  if (status === 'authenticated') {
    return <Navigate replace to="/app" />;
  }

  return <Navigate replace to="/login" />;
}

export function AppRouter() {
  return (
    <Routes>
      <Route element={<RootRedirect />} path="/" />
      <Route element={<LoginPage />} path="/login" />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />} path="/app">
          <Route element={<AppHomePage />} index />
          <Route element={<ConsultaPage />} path="consulta" />
        </Route>
      </Route>

      <Route element={<NotFoundPage />} path="*" />
    </Routes>
  );
}