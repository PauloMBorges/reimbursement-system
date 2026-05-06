import { useState } from 'react';
import { Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { UserFormDialog } from '@/components/shared/UserFormDialog';
import { useUsers } from '@/hooks/useUsers';
import { getErrorMessage } from '@/api/http';
import type { PerfilUsuario } from '@/types';

const PERFIL_LABEL: Record<PerfilUsuario, string> = {
  COLABORADOR: 'Colaborador',
  GESTOR: 'Gestor',
  FINANCEIRO: 'Financeiro',
  ADMIN: 'Admin',
};

const PERFIL_BADGE_STYLES: Record<PerfilUsuario, string> = {
  COLABORADOR: 'bg-blue-100 text-blue-700 border-blue-200',
  GESTOR: 'bg-purple-100 text-purple-700 border-purple-200',
  FINANCEIRO: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  ADMIN: 'bg-orange-100 text-orange-700 border-orange-200',
};

export function UsersPage() {
    const { data: users, isLoading, error } = useUsers();
    const [formOpen, setFormOpen] = useState(false);

    return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Usuários</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie os usuários com acesso ao sistema
          </p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo usuário
        </Button>
      </div>
      
    {/* Loading State: feedback imediato enquanto a API resolve a Promise */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}
      {/* Error State: tratamento amigável caso o token expire ou a rede caia */}
      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {getErrorMessage(error)}
        </div>
      )}
     {/* Empty State: Evita que a tela pareça "quebrada" se o banco estiver vazio */}
      {users && users.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">Nenhum usuário cadastrado.</p>
          </CardContent>
        </Card>
      )}
      {/* Data State: A tabela só é renderizada se houver dados de fato */}
      {users && users.length > 0 && (
        <Card>
          <CardContent className="p-0">
            <table className="w-full">
              <thead className="bg-muted/50 border-b">
                <tr className="text-left text-sm text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Nome</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Perfil</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b last:border-b-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm font-medium">{u.nome}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {u.email}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${PERFIL_BADGE_STYLES[u.perfil]}`}
                      >
                        {PERFIL_LABEL[u.perfil]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      <UserFormDialog open={formOpen} onOpenChange={setFormOpen} />
    </div>
  );
}