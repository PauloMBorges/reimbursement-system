import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Timeline } from '@/components/shared/Timeline';
import type { HistoricoEntry } from '@/types';

function makeEntry(overrides: Partial<HistoricoEntry> = {}): HistoricoEntry {
  return {
    id: 'h-1',
    solicitacaoId: 'r-1',
    usuarioId: 'u-1',
    acao: 'CREATED',
    observacao: null,
    criadoEm: '2026-04-01T10:00:00.000Z',
    usuario: {
      id: 'u-1',
      nome: 'Carlos Test',
      email: 'carlos@test.com',
      perfil: 'COLABORADOR',
    },
    ...overrides,
  };
}

describe('Timeline', () => {
  // se não tiver eventos, exibe mensagem
  it('exibe mensagem quando lista de eventos está vazia', () => {
    render(<Timeline entries={[]} />);
    expect(screen.getByText(/nenhum evento/i)).toBeInTheDocument();
  });

  // garante que a chave 'CREATED' está sendo traduzida corretamente
  it('renderiza um evento com nome do usuário e ação', () => {
    const entries = [makeEntry({ acao: 'CREATED' })];
    render(<Timeline entries={entries} />);

    expect(screen.getByText('Carlos Test')).toBeInTheDocument();
    expect(screen.getByText(/criou a solicitação/i)).toBeInTheDocument();
  });

  // prova que o bloco condicional realemente aparece na tela quando
  // os dados exigem
  it('exibe observação quando presente (caso de rejeição)', () => {
    const entries = [
      makeEntry({
        acao: 'REJECTED',
        observacao: 'Falta comprovante fiscal',
        usuario: {
          id: 'u-2',
          nome: 'Maria Gestora',
          email: 'maria@test.com',
          perfil: 'GESTOR',
        },
      }),
    ];
    render(<Timeline entries={entries} />);

    expect(screen.getByText('Maria Gestora')).toBeInTheDocument();
    expect(screen.getByText(/rejeitou a solicitação/i)).toBeInTheDocument();
    expect(screen.getByText('Falta comprovante fiscal')).toBeInTheDocument();
  });

  // garante que a ordem decrescente de data está sendo respeitada
  it('ordena eventos do mais recente para o mais antigo', () => {
    const entries: HistoricoEntry[] = [
      makeEntry({
        id: 'h-old',
        acao: 'CREATED',
        criadoEm: '2026-04-01T08:00:00.000Z',
      }),
      makeEntry({
        id: 'h-new',
        acao: 'SUBMITTED',
        criadoEm: '2026-04-02T08:00:00.000Z',
      }),
    ];
    render(<Timeline entries={entries} />);

    const elements = screen.getAllByText(/(criou|enviou)/i);
    expect(elements[0]).toHaveTextContent(/enviou/i); 
    expect(elements[1]).toHaveTextContent(/criou/i);
  });
});