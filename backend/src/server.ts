import { app } from './app';
import { env } from './config/env';

// Inicialização
const PORT = Number(process.env.PORT) || 3333;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Ambiente: ${env.NODE_ENV}`);
});
