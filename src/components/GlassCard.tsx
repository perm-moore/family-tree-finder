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
    subtle: 'glass-subtle shadow-frost rounded-xl',
    default: 'glass shadow-frost rounded-xl',
    strong: 'glass-strong shadow-frost-lg rounded-xl',
  };

  return (
    <div
      className={cn(
        variants[variant],
        hover && 'transition-luxury hover:shadow-heritage hover:scale-[1.015]',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
