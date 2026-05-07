import { env } from '@/config/env';

interface NotificationPayload {
  title: string;
  message: string;
  // Tags emoji do ntfy
  // Ex: ['white_check_mark'] vira ✅ no app.
  tags?: string[];

  // Prioridade (1-5). Default 3
  priority?: number;

  // Link clicável que abre ao tocar notificação
  click?: string;
}

// Envia notificação push via ntfy
// Se o serviço falhar, não bloqueia a operação principal

export async function sendNotification(
  payload: NotificationPayload,
): Promise<void> {
  if (!env.NTFY_TOPIC) {
    // Notific. desabilitadas
    return;
  }

  try {
    const headers: Record<string, string> = {
      Title: payload.title,
    };

    if (payload.tags && payload.tags.length > 0) {
      headers.Tags = payload.tags.join(',');
    }

    if (payload.priority !== undefined) {
      headers.Priority = String(payload.priority);
    }

    if (payload.click) {
      headers.Click = payload.click;
    }

    await fetch(`https://ntfy.sh/${env.NTFY_TOPIC}`, {
      method: 'POST',
      headers,
      body: payload.message,
    });
  } catch (err) {
    // Log mas não propaga erro
    console.warn('[ntfy] Falha ao enviar notificação: ', err);
  }
}
