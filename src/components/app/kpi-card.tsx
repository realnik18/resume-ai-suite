import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    trend: 'up' | 'down' | 'neutral';
    period?: string;
  };
  icon?: LucideIcon;
  className?: string;
}

export function KPICard({ title, value, change, icon: Icon, className }: KPICardProps) {
  const getTrendIcon = () => {
    switch (change?.trend) {
      case 'up':
        return TrendingUp;
      case 'down':
        return TrendingDown;
      default:
        return Minus;
    }
  };

  const getTrendColor = () => {
    switch (change?.trend) {
      case 'up':
        return 'text-green-600 dark:text-green-400';
      case 'down':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-muted-foreground';
    }
  };

  const TrendIcon = getTrendIcon();

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-1">{value}</div>
        {change && (
          <div className={cn('flex items-center text-xs', getTrendColor())}>
            <TrendIcon className="mr-1 h-3 w-3" />
            <span>
              {change.trend === 'up' ? '+' : change.trend === 'down' ? '-' : ''}
              {Math.abs(change.value)}
              {change.period && ` from ${change.period}`}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}