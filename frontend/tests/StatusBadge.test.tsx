import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusBadge } from '@/components/shared/StatusBadge';
import type { StatusSolicitacao } from '@/types';

describe('StatusBadge', () => {
  // Mapeamento esperado entre status e label visível ao usuário
  const cases: Array<{ status: StatusSolicitacao; label: string }> = [
    { status: 'RASCUNHO', label: 'Rascunho' },
    { status: 'ENVIADO', label: 'Enviado' },
    { status: 'APROVADO', label: 'Aprovado' },
    { status: 'REJEITADO', label: 'Rejeitado' },
    { status: 'PAGO', label: 'Pago' },
    { status: 'CANCELADO', label: 'Cancelado' },
  ];

  it.each(cases)('renderiza label "$label" para status $status', ({ status, label }) => {
    render(<StatusBadge status={status} />);
    expect(screen.getByText(label)).toBeInTheDocument();
  });
});