import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'subtle' | 'default' | 'strong';
  hover?: boolean;
  onClick?: () => void;
}

export function GlassCard({
  children,
  className,
  variant = 'default',
  hover = false,
  onClick,
}: GlassCardProps) {
  const variants = {
    subtle: 'glass-subtle shadow-frost',
    default: 'glass shadow-frost',
    strong: 'glass-strong shadow-frost-lg',
  };

  return (
    <div
      className={cn(
        'rounded-lg',
        variants[variant],
        hover && 'transition-elegant hover:shadow-frost-lg hover:scale-[1.02]',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
