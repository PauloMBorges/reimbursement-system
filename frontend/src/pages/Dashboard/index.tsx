import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/useAuth';

export function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-muted/30 p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Bem-vindo, {user?.nome}!</CardTitle>
            <CardDescription>
              Você está logado como{' '}
              <span className="font-semibold">{user?.perfil}</span> ({user?.email})
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={logout}>
              Sair
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Em construção</CardTitle>
            <CardDescription>
              A listagem de solicitações vai aparecer aqui depois.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}