import { Card, CardContent } from "../ui/card";
import type { ReactNode } from "react";
import { formatCurrency } from "@/lib/format";

interface StatCardProps {
    label: string;
    count: number;
    total: string;
    icon: ReactNode;
    accentClassName?: string;
}

export function StatCard({
    label,
    count,
    total,
    icon,
    accentClassName =  'bg-pitang-red/10 text-pitang-red',
}: StatCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
              {label}
            </p>
            <p className="text-2xl font-bold tabular-nums">{count}</p>
            <p className="text-xs text-muted-foreground truncate">
              {formatCurrency(parseFloat(total))}
            </p>
          </div>
          <div className={`rounded-lg p-2 ${accentClassName}`}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}