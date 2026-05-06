import { useState } from 'react';
import { toast } from 'sonner';
import { Edit, Plus, Power, PowerOff } from 'lucide-react';
import { TableSkeleton } from '@/components/shared/TableSkeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent} from '@/components/ui/card';
import { CategoryFormDialog } from '@/components/shared/CategoryFormDialog';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { useCategories } from '@/hooks/useCategories';
import { useCategoryMutations } from '@/hooks/useCategoryMutations';
import { getErrorMessage } from '@/api/http';
import type { Categoria } from '@/types';

export function CategoriesPage() {
    const { data: categories, isLoading, error } = useCategories();
    const { update } = useCategoryMutations();
    
    // Controla o modal de criação/edição
    const [formOpen, setFormOpen] = useState(false);
    // Guarda o objeto inteiro da categoria 
    // Permite modal 'filho' saber os dados para pré-preencher
    // Se for undefined significa que está criando uma nova
    const [editingCategory, setEditingCategory] = useState<Categoria | undefined>(
        undefined,
    );
    // Guarda a categoria que será desativada/ativada
    const [togglingCategory, setTogglingCategory] = useState<Categoria | undefined>(
        undefined,
    )

    function openCreate() {
        setEditingCategory(undefined);
        setFormOpen(true);
    }

    function openEdit(category: Categoria) {
        setEditingCategory(category);
        setFormOpen(true);
    }

    // Executa soft delete ou reativação (inverte a flag 'ativo')
    // Garante integridade referencial dos reembolsos já criados
    async function handleToggleActive() {
        if (!togglingCategory) return;
        try {
            await update.mutateAsync({
                id: togglingCategory.id,
                payload: { ativo: !togglingCategory.ativo },
            });
            toast.success(
                togglingCategory.ativo
                    ? 'Categoria desativada'
                    : 'Categoria ativada',
            );
            setTogglingCategory(undefined) // Fecha o dialog automaticamente após sucesso
        } catch (err) {
            toast.error(getErrorMessage(err))
        }
    }

    return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Categorias</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie as categorias disponíveis para classificação de reembolsos
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Nova categoria
        </Button>
      </div>

      {isLoading && <TableSkeleton rows={5} columns={3} />}

      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {getErrorMessage(error)}
        </div>
      )}

      {categories && categories.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">
              Nenhuma categoria cadastrada ainda.
            </p>
          </CardContent>
        </Card>
      )}

      {categories && categories.length > 0 && (
        <Card>
          <CardContent className="p-0">
            <table className="w-full">
              <thead className="bg-muted/50 border-b">
                <tr className="text-left text-sm text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Nome</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium w-32 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr
                    key={cat.id}
                    className="border-b last:border-b-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm font-medium">{cat.nome}</td>
                    <td className="px-4 py-3 text-sm">
                      {cat.ativo ? (
                        <span className="text-green-700">Ativa</span>
                      ) : (
                        <span className="text-muted-foreground">Inativa</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEdit(cat)}
                          aria-label="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setTogglingCategory(cat)}
                          aria-label={cat.ativo ? 'Desativar' : 'Ativar'}
                        >
                          {cat.ativo ? (
                            <PowerOff className="h-4 w-4" />
                          ) : (
                            <Power className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
      {/* Componente "Burro". Só renderiza as informações que passamos. */}
      <CategoryFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        category={editingCategory}
      />
      {/* Renderização Condicional: A mensagem, o ícone e a variante de 
      cor mudam dependendo de estarmos ativando ou desativando */}
      <ConfirmDialog
        open={!!togglingCategory}
        onOpenChange={(open) => !open && setTogglingCategory(undefined)}
        title={
          togglingCategory?.ativo ? 'Desativar categoria?' : 'Ativar categoria?'
        }
        description={
          togglingCategory?.ativo
            ? 'Categorias inativas não aparecem no formulário de criação de reembolsos. Reembolsos existentes nessa categoria continuam funcionando.'
            : 'A categoria voltará a aparecer na lista de seleção ao criar reembolsos.'
        }
        confirmLabel={togglingCategory?.ativo ? 'Desativar' : 'Ativar'}
        variant={togglingCategory?.ativo ? 'destructive' : 'default'}
        isLoading={update.isPending}
        onConfirm={handleToggleActive}
      />
    </div>
  ); 
}