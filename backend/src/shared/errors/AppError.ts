// Classe base para erros da aplicação

// Qualquer erro lançado por services/controllers que herde dessa classe
// será tratado pelo errorMiddleware como erro esperado (400, 401, 403, 404...)

// Erros que não herdam de AppError caem no fallback (500)

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errorName: string;

  constructor(message: string, statusCode: number, errorName: string) {
    super(message);
    this.statusCode = statusCode;
    this.errorName = errorName;

    // Resolve o problema do TypeScipt ao herdar de classes nativas (Error)
    // Sem isso, o instanceof BadRequestError pode retornar false
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
