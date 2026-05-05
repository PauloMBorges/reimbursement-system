import { Navigate, Route, Routes } from 'react-router-dom';
import { PrivateRoute } from '@/components/shared/PrivateRoute';
import { AppLayout } from '@/components/layout/AppLayout';
import { LoginPage } from '@/pages/Login';
import { DashboardPage } from '@/pages/Dashboard';

export function AppRoutes() {
  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/login" element={<LoginPage />} />

      {/* Rotas privadas */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <AppLayout>
              <DashboardPage />
            </AppLayout>
          </PrivateRoute>
        }
      />

      {/* Redireciona raiz para dashboard (que cuida de auth) */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Catch-all: rota desconhecida → dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}