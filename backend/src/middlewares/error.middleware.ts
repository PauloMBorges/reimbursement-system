import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { AppError } from '@/shared/errors';
import { env } from '@/config/env';

// Middleware global de tratamento de erros

// O Express identifica se um middleware é 'normal' ou de 'erro' pelo número de parâmetros (3 para normal, 4 para erro)
// (err, req, res, next), por isso o '_next' precisa estar declarado mesmo que não seja usado.

export const errorMiddleware: ErrorRequestHandler = (err, _req, res, _next) => {
  // 1. Erros conhecidos da aplicação
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
      statusCode: err.statusCode,
      error: err.errorName,
    });
  }

  // 2. Erros de validação do Zod
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: 'Dados inválidos',
      statusCode: 400,
      error: 'Bad Request',
      issues: err.flatten().fieldErrors,
    });
  }

  // 3. Erros inesperados - log no servidor e resposta  genérica ao cliente
  console.error('Erro não tratado: ', err);

  return res.status(500).json({
    message: 'Erro interno do servidor',
    statusCode: 500,
    error: 'Internal Server Error',
    // Em desenvolvimento, mostramos o stack trace para facilitar o debugging
    ...(env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
