import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import 'dayjs/locale/pt-br';

dayjs.extend(utc);
dayjs.locale('pt-br');

// Formata um valor decinal (em string ou number) para moeda BRL
// Aceita string porque o Prisma serializa decimal como string

export function formatCurrency(value: string | number): string {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(numValue);
}

// Formata uma data ISO string para DD/MM/YYYY
export function formatDate(date: string):string {
    return dayjs.utc(date).format('DD/MM/YYYY');
}

// Formata uma data ISO string para DD/MM/YYYY HH:mm 
// Usado em timestamps de histórico
export function formatDateTime(date: string): string {
    return dayjs(date).format('DD/MM/YYYY HH:mm');
}