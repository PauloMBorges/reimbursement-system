import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { ReimbursementActions } from '@/components/shared/ReimbursementActions';
import { renderWithProviders, makeUser } from './utils';
import type { Reimbursement, StatusSolicitacao } from '@/types';

// cria um reembolso mockado para os testes
function makeReimbursement(
  overrides: Partial<Reimbursement> = {},
): Reimbursement {
  return {
    id: 'r-1',
    solicitanteId: 'user-owner',
    categoriaId: 'cat-1',
    descricao: 'Teste',
    valor: '100.00',
    dataDespesa: '2026-04-01',
    status: 'RASCUNHO',
    justificativaRejeicao: null,
    criadoEm: '2026-04-01T10:00:00.000Z',
    atualizadoEm: '2026-04-01T10:00:00.000Z',
    categoria: { id: 'cat-1', nome: 'Alimentação', ativo: true },
    solicitante: {
      id: 'user-owner',
      nome: 'Owner',
      email: 'owner@test.com',
      perfil: 'COLABORADOR',
    },
    ...overrides,
  };
}

describe('ReimbursementActions - visibilidade por perfil e status', () => {

  // Testa as ações do usuário COLABORADOR
  describe('Dono COLABORADOR', () => {
    const owner = makeUser({ id: 'user-owner', perfil: 'COLABORADOR' });

    // Testa o estado de RASCUNHO
    it('em RASCUNHO mostra Editar, Enviar e Cancelar', () => {
      const reimbursement = makeReimbursement({ status: 'RASCUNHO' });
      // renderiza o componente com o reembolso mockado e o usuário dono
      renderWithProviders(<ReimbursementActions reimbursement={reimbursement} />, {
        authValue: { user: owner },
      });

      expect(screen.getByRole('button', { name: /editar/i })).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /enviar para aprovação/i }),
      ).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
    });

    // Testa o estado de ENVIADO
    it('em ENVIADO mostra apenas Cancelar', () => {
      const reimbursement = makeReimbursement({ status: 'ENVIADO' });
      renderWithProviders(<ReimbursementActions reimbursement={reimbursement} />, {
        authValue: { user: owner },
      });

      expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
      // queryByRole retorna null se não encontrar o elemento (ao inves de lançar erro)
      expect(screen.queryByRole('button', { name: /editar/i })).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: /enviar para aprovação/i }),
      ).not.toBeInTheDocument();
    });

    // Testa o estado de APROVADO
    it('em APROVADO não mostra nenhum botão', () => {
      const reimbursement = makeReimbursement({ status: 'APROVADO' });
      const { container } = renderWithProviders(
        <ReimbursementActions reimbursement={reimbursement} />,
        { authValue: { user: owner } },
      );

      // Nenhum botão deve aparecer (componente retorna null)
      expect(container.querySelectorAll('button').length).toBe(0);
    });
  });

  describe('GESTOR', () => {
    const gestor = makeUser({ id: 'gestor-1', perfil: 'GESTOR' });

    it('em ENVIADO mostra Aprovar e Rejeitar', () => {
      const reimbursement = makeReimbursement({ status: 'ENVIADO' });
      renderWithProviders(<ReimbursementActions reimbursement={reimbursement} />, {
        authValue: { user: gestor },
      });

      expect(screen.getByRole('button', { name: /aprovar/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /rejeitar/i })).toBeInTheDocument();
    });

    it('em RASCUNHO não mostra nenhum botão (não é dono)', () => {
      const reimbursement = makeReimbursement({ status: 'RASCUNHO' });
      const { container } = renderWithProviders(
        <ReimbursementActions reimbursement={reimbursement} />,
        { authValue: { user: gestor } },
      );

      expect(container.querySelectorAll('button').length).toBe(0);
    });

    it('em APROVADO não mostra Pagar (não é financeiro)', () => {
      const reimbursement = makeReimbursement({ status: 'APROVADO' });
      const { container } = renderWithProviders(
        <ReimbursementActions reimbursement={reimbursement} />,
        { authValue: { user: gestor } },
      );

      expect(container.querySelectorAll('button').length).toBe(0);
    });
  });

  describe('FINANCEIRO', () => {
    const financeiro = makeUser({ id: 'fin-1', perfil: 'FINANCEIRO' });

    it('em APROVADO mostra Registrar pagamento', () => {
      const reimbursement = makeReimbursement({ status: 'APROVADO' });
      renderWithProviders(<ReimbursementActions reimbursement={reimbursement} />, {
        authValue: { user: financeiro },
      });

      expect(
        screen.getByRole('button', { name: /registrar pagamento/i }),
      ).toBeInTheDocument();
    });

    it('em ENVIADO não mostra nenhum botão', () => {
      const reimbursement = makeReimbursement({ status: 'ENVIADO' });
      const { container } = renderWithProviders(
        <ReimbursementActions reimbursement={reimbursement} />,
        { authValue: { user: financeiro } },
      );

      expect(container.querySelectorAll('button').length).toBe(0);
    });
  });

  describe('ADMIN', () => {
    const admin = makeUser({ id: 'admin-1', perfil: 'ADMIN' });

    it('não mostra botões de ação (admin não opera no fluxo)', () => {
      const cases: StatusSolicitacao[] = ['RASCUNHO', 'ENVIADO', 'APROVADO'];

      // Executa a mesma lógica contra vários cenários
      cases.forEach((status) => {
        const reimbursement = makeReimbursement({ status });
        // extrai o método unmount do resultado do render
        const { container, unmount } = renderWithProviders(
          <ReimbursementActions reimbursement={reimbursement} />,
          { authValue: { user: admin } },
        );

        expect(container.querySelectorAll('button').length).toBe(0);
        // chama unmount no final de cada laço do forEach para evitar 
        // que o render da segunda iteração insira o componente sobre 
        // o componente da primeira (libera recursos)
        unmount();
      });
    });
  });
});