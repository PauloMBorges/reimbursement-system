import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { AppRoutes } from '@/routes';

// Configuração global do TanStack Query.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Dentro desse período (30s), navegar entre telas não dispara refetch
      staleTime: 30 * 1000,
      // Não re-busca automaticamente quando a janela ganha foco
      refetchOnWindowFocus: false,
      // Erros 4xx normalmente não devem ser retentados (validação, RBAC, etc)
      retry: (failureCount, error: unknown) => {
        if (
          typeof error === 'object' &&
          error !== null &&
          'response' in error &&
          typeof (error as { response?: { status?: number } }).response?.status === 'number' &&
          (error as { response: { status: number } }).response.status >= 400 &&
          (error as { response: { status: number } }).response.status < 500
        ) {
          return false;
        }
        return failureCount < 2;
      },
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
      <Toaster richColors position="top-right" />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;