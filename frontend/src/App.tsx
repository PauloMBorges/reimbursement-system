import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

function App() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Reimbursement System</CardTitle>
          <CardDescription>
            Setup do frontend 
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Button>Botão Primary</Button>
          <Button variant="outline">Botão Outline</Button>
          <Button variant="destructive">Destructive</Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;