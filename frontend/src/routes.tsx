import { Navigate, Route, Routes } from 'react-router-dom';
import { PrivateRoute } from '@/components/shared/PrivateRoute';
import { AppLayout } from '@/components/layout/AppLayout';
import { LoginPage } from '@/pages/Login';
import { DashboardPage } from '@/pages/Dashboard';
import { ReimbursementCreatePage } from '@/pages/ReimbursementCreate';
import { ReimbursementEditPage } from '@/pages/ReimbursementEdit';
import { ReimbursementDetailPage } from '@/pages/ReimbursementDetail';
import { CategoriesPage } from '@/pages/Categories';
import { UsersPage } from '@/pages/Users';


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

      <Route
        path="/reimbursements/new"
        element={
          <PrivateRoute allowedRoles={['COLABORADOR']}>
            <AppLayout>
              <ReimbursementCreatePage />
            </AppLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/reimbursements/:id"
        element={
          <PrivateRoute>
            <AppLayout>
              <ReimbursementDetailPage />
            </AppLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/reimbursements/:id/edit"
        element={
          <PrivateRoute allowedRoles={['COLABORADOR']}>
            <AppLayout>
              <ReimbursementEditPage />
            </AppLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/admin/categories"
        element={
          <PrivateRoute allowedRoles={['ADMIN']}>
            <AppLayout>
              <CategoriesPage />
            </AppLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <PrivateRoute allowedRoles={['ADMIN']}>
            <AppLayout>
              <UsersPage />
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
