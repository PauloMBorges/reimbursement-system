import { Link, NavLink } from 'react-router-dom';
import { LogOut, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/useAuth';

export function Header() {
  const { user, logout, hasRole } = useAuth();
  const isAdmin = hasRole('ADMIN');


  return (
    <header className="border-b bg-background sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link
            to="/dashboard"
            className="flex items-center gap-2.5 font-semibold group"
          >
            <div className="bg-pitang-red rounded-lg p-1.5 transition-transform group-hover:scale-105">
              <Receipt className="h-4 w-4 text-white" />
            </div>
            <span className="text-base">Reembolsos</span>
          </Link>

          {isAdmin && (
            <nav className="flex items-center gap-1">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-md text-sm transition-colors ${
                    isActive
                      ? 'bg-pitang-red/10 text-pitang-red font-medium'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`
                }
                end
              >
                Solicitações
              </NavLink>
              <NavLink
                to="/admin/categories"
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-md text-sm transition-colors ${
                    isActive
                      ? 'bg-pitang-red/10 text-pitang-red font-medium'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
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
                      ? 'bg-pitang-red/10 text-pitang-red font-medium'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`
                }
              >
                Usuários
              </NavLink>
            </nav>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium leading-none">{user?.nome}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{user?.perfil}</p>
          </div>
          <div className="h-8 w-px bg-border hidden sm:block" />
          <Button variant="ghost" size="sm" onClick={logout}>
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>
    </header>
  );
}
