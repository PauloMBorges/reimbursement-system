import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/useAuth';

export function NewReimbursementButton() {
  const { hasRole } = useAuth();

  if (!hasRole('COLABORADOR')) return null;

  return (
    <Button asChild className="shadow-sm shadow-pitang-red/20">
      <Link to="/reimbursements/new">
        <Plus className="h-4 w-4 mr-2" />
        Nova solicitação
      </Link>
    </Button>
  );
}
