import { Link } from 'react-router-dom';
import { LogOut, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/useAuth';

export function Header() {
    const { user, logout } = useAuth();

    return (
    <header className="border-b bg-background">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2 font-semibold">
          <Receipt className="h-5 w-5" />
          <span>Sistema de Reembolsos</span>
        </Link>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium">{user?.nome}</p>
            <p className="text-xs text-muted-foreground">{user?.perfil}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={logout}>
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>
    </header>
  );
}