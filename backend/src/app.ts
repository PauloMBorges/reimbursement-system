import express, { Request, Response } from 'express';
import cors from 'cors';
import { errorMiddleware } from '@/middlewares/error.middleware';

const app = express();

// Middlewares globais
app.use(cors());
app.use(express.json());

// Rotas
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Rotas da aplicação

// Middleware de erros
app.use(errorMiddleware);

export { app };
