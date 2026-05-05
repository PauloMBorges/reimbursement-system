import type { ReactNode } from 'react';
import { Header } from './Header';

interface AppLayoutProps {
    children: ReactNode;
}

// Wrapper simples que vai envolver toda página privada
// Centraliza o max-w-6x1 em um só lugar

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}