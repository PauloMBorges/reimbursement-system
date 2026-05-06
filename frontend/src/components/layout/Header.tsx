import { Link, NavLink } from 'react-router-dom';
import { LogOut, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/useAuth';

export function Header() {
  const { user, logout, hasRole } = useAuth();
  const isAdmin = hasRole('ADMIN');

return (
    <header className="border-b bg-background">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="flex items-center gap-2 font-semibold">
            <Receipt className="h-5 w-5" />
            <span>Sistema de Reembolsos</span>
          </Link>

          {isAdmin && (
            <nav className="flex items-center gap-1">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-md text-sm transition-colors ${
                    isActive
                      ? 'bg-muted text-foreground font-medium'
                      : 'text-muted-foreground hover:text-foreground'
                  }`
                }
                end
              >
                Reembolsos
              </NavLink>
              <NavLink
                to="/admin/categories"
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-md text-sm transition-colors ${
                    isActive
                      ? 'bg-muted text-foreground font-medium'
                      : 'text-muted-foreground hover:text-foreground'
                  }`
                }
              >
                Categorias
              </NavLink>
              <NavLink
                to="/admin/users"
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-md text-sm transition-colors ${
                    isActive
                      ? 'bg-muted text-foreground font-medium'
                      : 'text-muted-foreground hover:text-foreground'
                  }`
                }
              >
                Usuários
              </NavLink>
            </nav>
          )}
        </div>

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
