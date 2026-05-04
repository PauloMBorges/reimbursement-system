import { z } from 'zod';
import { TipoArquivo } from '@prisma/client';

// Schema para criaçáo de anexo simulado
// Sem upload real, então recebe metadados via JSON:
// - nomeArquivo: como aparece para o usuário (ex: "comprovante.pdf")
// -urlArquivo: URL onde o arquivo 'estaria' hospedado
// - tipoArquivo: PDF, JPG ou PNG (enum do Prisma)

export const createAttachmentSchema = z.object({
  nomeArquivo: z
    .string()
    .min(1, 'Nome do arquivo é obrigatório')
    .max(255, 'Nome do arquivo deve ter no máximo 255 caracteres')
    .trim(),
  urlArquivo: z
    .string()
    .url('URL do arquivo deve ser válida')
    .max(500, 'URL do arquivo deve ter no máximo 500 caracteres'),
  tipoArquivo: z.nativeEnum(TipoArquivo, {
    errorMap: () => ({
      message: 'Tipo de arquivo deve ser PDF, JPG ou PNG',
    }),
  }),
});

export type CreateAttachmentInput = z.infer<typeof createAttachmentSchema>;
