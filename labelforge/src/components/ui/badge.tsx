import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'accent';

const variants: Record<BadgeVariant, string> = {
  default: 'bg-forge-panel text-forge-muted border border-forge-border',
  success: 'bg-forge-success-muted text-forge-success border border-forge-success/20',
  warning: 'bg-forge-warning-muted text-forge-warning border border-forge-warning/20',
  error: 'bg-forge-error-muted text-forge-error border border-forge-error/20',
  info: 'bg-forge-accent-muted/40 text-forge-info border border-forge-info/20',
  accent: 'bg-forge-accent-muted text-forge-accent border border-forge-accent/30',
};

export function Badge({
  children,
  variant = 'default',
  className,
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
