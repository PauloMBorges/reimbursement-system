import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors'

const app = express();

// ─────────────────────────────────────────────
// Middlewares globais
// ────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─────────────────────────────────────────────
// Rotas
// ─────────────────────────────────────────────
app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});

// ─────────────────────────────────────────────
// Inicialização
// ─────────────────────────────────────────────
const PORT = Number(process.env.PORT) || 3333;

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`)
});