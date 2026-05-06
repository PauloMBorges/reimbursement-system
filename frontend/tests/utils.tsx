import type { ReactElement, ReactNode } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { AuthContext, type AuthContextValue } from '@/contexts/auth-context';
import type { PerfilUsuario, Usuario } from '@/types';

interface RenderProvidersOptions extends Omit<RenderOptions, 'wrapper'> {
    // Estado inicial do AuthContext
    // Se omitido, fornece contexto 'nao autenticado' (user: null)
    authValue ?: Partial<AuthContextValue>;

    // Rota inicial em testes
    // Se fornecida usa MemoryRouter
    initialRoute?: string;
}

// Render que envolve o componente Providers do app
// Usado por todos testes que precisam do contexto completo
export function renderWithProviders(
    ui: ReactElement,
    options: RenderProvidersOptions = {},
) {
    const { authValue, initialRoute, ...rest} = options;

    // Instancia QueryClient dentro da função render
    // Garante que cada teste (it/test) receba um cache limpo
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false }, // Em testes, falha na hora (ao invés de esperar timeout)
            mutations: { retry: false },
        },
    });

    const defaultAuthValue: AuthContextValue = {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        login: async () => {},
        logout: () => {},
        hasRole: () => false,
        ...authValue,
    };

    // Se usuário foi fornecido em authValue, garante que 
    // isAuthenticated e hasRole reflitam esse usuário
    if (authValue?.user && !('isAuthenticated' in (authValue ?? {}))) {
        defaultAuthValue.isAuthenticated = true;
    }
    if (authValue?.user && !('hasRole' in (authValue ?? {}))) {
        defaultAuthValue.hasRole = (...perfis: PerfilUsuario[]) => 
            perfis.includes(authValue.user!.perfil);
    }

    function Wrapper({ children }: { children: ReactNode }) {
        // MemoryRouter permite simular navegação guardando a URL na memória RAM
        const Router = initialRoute ? MemoryRouter : BrowserRouter;
        const routerProps = initialRoute ? { initialEntries: [initialRoute] } : {};

        return (
            <QueryClientProvider client={queryClient}>
                <Router {...routerProps}>
                    <AuthContext.Provider value={defaultAuthValue}>
                        {children}
                    </AuthContext.Provider>
                </Router>
            </QueryClientProvider>
        );
    }

    return render(ui, { wrapper: Wrapper, ...rest });
}

// Factories de objetos 

// Cria um Usuario fake com defaults 
// Override apenas o que importa para o teste
export function makeUser(overrides: Partial<Usuario> = {}): Usuario {
    return {
        id: 'user-1',
        nome: 'Test User',
        email: 'test@example.com',
        perfil: 'COLABORADOR',
        ...overrides,
    };
}
