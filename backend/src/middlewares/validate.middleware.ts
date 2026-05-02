import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

type RequestPart = 'body' | 'params' | 'query';

// Factory que cria middleware de validação para uma parte específica da requisição
// Uso nas rotas:
//      router.post('/', validate(loginSchema, 'body'), authController.login);
// Se a validação falhar, o ZodError é lançado e capturado pelo errorMiddleware global, que retorna 400 Bad Request

export function validate(schema: ZodSchema, part: RequestPart = 'body') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse(req[part]);
      req[part] = parsed; // Zod, além de validar, trasnforma os dados (ex: se o schema converte string em number, o controller recebe o tipo certo)
      next();
    } catch (err) {
      next(err); // aqui é onde o erro é lançado e capturado pelo errorMiddleware global
    }
  };
}
