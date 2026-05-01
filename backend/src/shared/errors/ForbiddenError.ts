import { AppError } from "./AppError";

export class ForbiddenError extends AppError {
    constructor(message = 'Sem permissão para realizar esta ação') {
        super(message, 403, 'Forbidden');
    }
}