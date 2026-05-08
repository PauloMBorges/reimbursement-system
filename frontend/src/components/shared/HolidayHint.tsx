import { Info } from 'lucide-react';
import { useHolidays } from '@/hooks/useHolidays';

interface HolidayHintProps {
  date: string | undefined;
}


// Mostra alerta visual quando a data selecionada coincide com feriado nacional
// Integração com BrasilAPI sem complicar a UI base do datepicker
export function HolidayHint({ date }: HolidayHintProps) {
  // Extrai o ano da data (ou usa o atual)
  const year = date ? new Date(date).getFullYear() : new Date().getFullYear();
  const { data: holidays } = useHolidays(year);

  if (!date || !holidays) return null;

  // Procura feriado correspondente à data selecionada
  const holiday = holidays.find((h) => h.date === date);

  if (!holiday) return null;

  return (
    <div className="flex items-start gap-2 mt-1.5 px-2.5 py-1.5 rounded-md bg-amber-50 border border-amber-200 text-amber-900">
      <Info className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
      <p className="text-xs">
        <span className="font-medium">{holiday.name}</span>
        <span className="text-amber-700"> · feriado nacional</span>
      </p>
    </div>
  );
}



