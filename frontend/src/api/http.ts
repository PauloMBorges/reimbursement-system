import axios, { AxiosError } from 'axios';
import type { ApiError } from '@/types';

// Instância única do Axios para toda aplicação
// Configuração:
// - baseURL vem do .env (VITE_API_URL)
// - request interceptor: anexa Bearer Token quando disponível
// - response interceptor: em 401, limpa sessão e redireciona ao login

export const http = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

const TOKEN_STORAGE_KEY = 'reimbursements:token';
const USER_STORAGE_KEY = 'reimbursements:user';

// Helpers para gerenciar o token no localStorage

export const tokenStorage = {
    get: () => localStorage.getItem(TOKEN_STORAGE_KEY),
    set: (token: string) => localStorage.setItem(TOKEN_STORAGE_KEY, token),
    remove: () => localStorage.removeItem(TOKEN_STORAGE_KEY),
};

export const userStorage = {
    get: () => {
        const raw = localStorage.getItem(USER_STORAGE_KEY);
        return raw ? JSON.parse(raw) : null; 
    },
    set: (user: unknown) => 
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user)),
    remove: () => localStorage.removeItem(USER_STORAGE_KEY),
};

// Interceptor de requisição: anexa o token automaticamente

http.interceptors.request.use((config) => {
    const token = tokenStorage.get();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor de resposta: trata 401 (token expirado / inválido)

http.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401) {
        // Limpa sessão e redireciona para login
      tokenStorage.remove();
      userStorage.remove();

      // Evita redirect loop quando o proprio /auth/login retorna 401
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

// Extrai mensagem amigável de qualquer erro da API
// Cobre os formatos do backend

export function getErrorMessage(error: unknown): string {
    if (axios.isAxiosError<ApiError>(error)) {
        const data = error.response?.data;

        // Erro do zod com campos específicos
        if (data?.issues) {
            const firstField = Object.values(data.issues)[0];
            if (firstField && firstField.length > 0) {
                return firstField[0];
            }
        }

        // Erro do Zod a nível do objeto (.refine())
        if (data?.formErrors && data.formErrors.length > 0) {
            return data.formErrors[0];
        }

        // Mensagem direta
        if (data?.message) {
            return data.message;
        }

        // Erro de rede (sem response)
        if (error.code === 'ERR_NETWORK') {
            return 'Não foi possível conectar ao servidor. Verifique se a API está rodando.';
        }

        return 'Ocorreu um erro inesperado. Tente novamente.'
    }
}