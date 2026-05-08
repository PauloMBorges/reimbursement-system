import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface Holiday {
    date: string;
    name: string;
    type: string;
}

// Busca feriados nacionais do ano via BrasilAPI
// API pública, sem autenticação:
// https://brasilapi.com.br/api/feriados/v1/{ano}
// Cache longo (24h)

export function useHolidays(year: number = new Date().getFullYear()) {
  return useQuery({
    queryKey: ['holidays', year],
    queryFn: async () => {
      const { data } = await axios.get<Holiday[]>(
        `https://brasilapi.com.br/api/feriados/v1/${year}`,
      );
      return data;
    },
    staleTime: 24 * 60 * 60 * 1000, // 24 horas
    retry: 1, // se falhar, tenta só uma vez (API externa)
  });
}