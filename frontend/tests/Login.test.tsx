import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginPage } from '@/pages/Login';
import { renderWithProviders } from './utils';

// Mock do navegador (useNavigate não pode ser usado em teste sem Router real)
// vi.fn() importa tudo original e sobrescrevemos apenas o useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>(
    'react-router-dom',
  );
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('LoginPage', () => {
  // limpa o mockNavigate antes de cada teste
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renderiza os campos de email e senha', () => {
    renderWithProviders(<LoginPage />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  it('exibe erro quando submete email vazio', async () => {
    // userEvent simula comportamento real (ex: digitar caractere por caractere com delays)
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />);

    const submitButton = screen.getByRole('button', { name: /entrar/i });
    await user.click(submitButton);

    // espera ate que o elemento apareça
    await waitFor(() => {
      expect(screen.getByText(/email é obrigatório/i)).toBeInTheDocument();
    });
  });

    it('mostra os dois erros de validação simultaneamente quando submete tudo vazio', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />);

    await user.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
        expect(screen.getByText(/email é obrigatório/i)).toBeInTheDocument();
        expect(screen.getByText(/senha é obrigatória/i)).toBeInTheDocument();
    });
    });

  it('exibe erro quando submete senha vazia', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />);

    await user.type(screen.getByLabelText(/email/i), 'valido@email.com');
    await user.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(screen.getByText(/senha é obrigatória/i)).toBeInTheDocument();
    });
  });

  it('chama login do contexto quando dados são válidos', async () => {
    const user = userEvent.setup();
    const mockLogin = vi.fn();

    renderWithProviders(<LoginPage />, {
      authValue: {
        login: mockLogin,
      },
    });

    await user.type(screen.getByLabelText(/email/i), 'valido@email.com');
    await user.type(screen.getByLabelText(/senha/i), 'senha123');
    await user.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('valido@email.com', 'senha123');
    });
  });
});