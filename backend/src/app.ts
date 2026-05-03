import express, { Request, Response } from 'express';
import cors from 'cors';
import { errorMiddleware } from '@/middlewares/error.middleware';
import { authRoutes } from '@/modules/auth/auth.routes';
import { usersRoutes } from '@/modules/users/users.routes';
import { categoriesRoutes } from '@/modules/categories/categories.routes';

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

app.use('/auth', authRoutes);
app.use('/users', usersRoutes);
app.use('/categories', categoriesRoutes);

// Middleware de erros
app.use(errorMiddleware);

export { app };
