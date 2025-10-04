import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ className, size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div className={cn('font-bold text-brand', sizeClasses[size], className)}>
      A•AI
    </div>
  );
}

export function LogoWithText({ className, size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Logo size={size} />
      <span className={cn('font-medium text-foreground', sizeClasses[size])}>
        ApplyPro AI
      </span>
    </div>
  );
}