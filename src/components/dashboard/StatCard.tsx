
import { ReactNode } from 'react';
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  change?: number;
  changeLabel?: string;
  className?: string;
}

const StatCard = ({
  title,
  value,
  icon,
  change,
  changeLabel = 'vs last period',
  className,
}: StatCardProps) => {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <div className={cn('stat-card', className)}>
      <div className="flex justify-between items-start">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className="p-2 bg-primary/10 text-primary rounded-md">{icon}</div>
      </div>
      <div className="mt-2">
        <h3 className="text-2xl font-bold">{value}</h3>
        {change !== undefined && (
          <div className="flex items-center mt-1">
            <span
              className={cn(
                'text-xs font-medium flex items-center',
                isPositive ? 'text-emerald-600' : isNegative ? 'text-rose-500' : 'text-slate-600'
              )}
            >
              {isPositive && <ArrowUpIcon className="mr-1" size={14} />}
              {isNegative && <ArrowDownIcon className="mr-1" size={14} />}
              {Math.abs(change)}%
            </span>
            <span className="text-xs text-slate-500 ml-1.5">{changeLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
