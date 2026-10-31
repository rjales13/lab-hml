import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface iDashboardCardProps {
  title: string;
  icon: LucideIcon;
  value: string | number;
  subtitle?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'danger' | 'warning' | 'success' | 'info';
  href?: string;
  className?: string;
}

const variants = {
  default: {
    border: 'border-slate-200',
    iconBg: 'bg-slate-100',
    iconColor: 'text-slate-600',
    dot: 'bg-slate-400',
  },
  danger: {
    border: 'border-red-200',
    iconBg: 'bg-red-50',
    iconColor: 'text-red-500',
    dot: 'bg-red-500',
  },
  warning: {
    border: 'border-amber-200',
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-500',
    dot: 'bg-amber-500',
  },
  success: {
    border: 'border-emerald-200',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-500',
    dot: 'bg-emerald-500',
  },
  info: {
    border: 'border-blue-200',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-500',
    dot: 'bg-blue-500',
  },
};

export const DashboardCard = ({
  title,
  icon: Icon,
  value,
  subtitle,
  children,
  variant = 'default',
  href,
  className,
}: iDashboardCardProps) => {
  const style = variants[variant];

  const content = (
    <Card
      className={cn(
        'relative h-full overflow-hidden transition-all duration-300',
        href ? 'hover:-translate-y-1 hover:shadow-xl active:scale-[0.98]' : '',
        className,
        style.border
      )}
    >
      <CardContent className="flex h-full flex-col p-0">
        <div className="flex grow flex-col p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                {title}
              </p>
              <h2 className="font-black tracking-tight text-slate-900 md:text-4xl">
                {value}
              </h2>
            </div>
            <div
              className={cn(
                'rounded-2xl p-3 shadow-inner transition-colors',
                style.iconBg
              )}
            >
              <Icon className={cn('h-7 w-7', style.iconColor)} />
            </div>
          </div>

          {subtitle && (
            <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-slate-500">
              <span
                className={cn(
                  'h-1.5 w-1.5 animate-pulse rounded-full',
                  style.dot
                )}
              />
              {subtitle}
            </div>
          )}
        </div>

        {children && (
          <div className="border-t border-slate-100/80 bg-slate-50/40 px-6 py-5 backdrop-blur-sm">
            {children}
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (href) {
    return (
      <Link href={href} className={cn('block h-full no-underline', className)}>
        {content}
      </Link>
    );
  }

  return content;
};
