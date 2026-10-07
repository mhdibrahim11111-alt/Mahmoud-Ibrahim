import React from 'react';

/**
 * Reusable Design System Primitives
 * Standardized for Arabic RTL, WCAG AA contrast, and zero-clutter hierarchy.
 */

// 1. Standard Button
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'start' | 'end';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'start',
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-bold transition-all duration-150 select-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:scale-[0.98]";

  const variantClasses = {
    primary:
      "bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 shadow-sm shadow-amber-500/20 rounded-xl",
    secondary:
      "bg-slate-800 hover:bg-slate-700 active:bg-slate-800/90 text-slate-100 border border-slate-700/80 rounded-xl",
    outline:
      "bg-transparent hover:bg-slate-800/60 active:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600 rounded-xl",
    ghost:
      "bg-transparent hover:bg-slate-800/70 text-slate-300 hover:text-white rounded-xl",
    danger:
      "bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 rounded-xl",
    success:
      "bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 rounded-xl",
  };

  const sizeClasses = {
    sm: "min-h-[36px] px-3 py-1.5 text-xs gap-1.5",
    md: "min-h-[44px] px-4 py-2 text-sm gap-2",
    lg: "min-h-[48px] px-5 py-2.5 text-base gap-2.5",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && iconPosition === 'start' && <span className="shrink-0">{icon}</span>}
      {children && <span>{children}</span>}
      {icon && iconPosition === 'end' && <span className="shrink-0">{icon}</span>}
    </button>
  );
};

// 2. Standard Card
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'interactive' | 'highlight' | 'muted';
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  className = '',
  ...props
}) => {
  const base = "rounded-2xl transition-all duration-200";

  const variantStyles = {
    default: "bg-slate-900/70 border border-slate-800/80 shadow-sm",
    interactive: "bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 cursor-pointer shadow-sm active:scale-[0.99]",
    highlight: "bg-gradient-to-br from-slate-900 via-slate-900/90 to-amber-950/20 border border-amber-500/30 shadow-md shadow-amber-500/5",
    muted: "bg-slate-950/60 border border-slate-800/60",
  };

  return (
    <div className={`${base} ${variantStyles[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
};

// 3. Standard Progress Bar
export interface ProgressBarProps {
  value: number; // 0 to 100
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
  variant?: 'amber' | 'emerald' | 'gradient';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  size = 'md',
  showLabel = false,
  className = '',
  variant = 'gradient',
}) => {
  const clamped = Math.min(100, Math.max(0, Math.round(value)));

  const heightClasses = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-3.5",
  };

  const fillVariants = {
    amber: "bg-amber-400",
    emerald: "bg-emerald-400",
    gradient: "bg-gradient-to-l from-amber-400 to-emerald-400",
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-semibold text-slate-400 mb-1.5">
          <span>مستوى الإنجاز</span>
          <span dir="ltr" className="font-mono text-slate-200">{clamped}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-800/90 rounded-full overflow-hidden ${heightClasses[size]}`}>
        <div
          role="progressbar"
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
          className={`${fillVariants[variant]} h-full rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};

// 4. Metric / Stat Card
export interface StatCardProps {
  title: string;
  value: React.ReactNode;
  subtitle?: string;
  icon?: React.ReactNode;
  iconBg?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  iconBg = 'bg-slate-800/80 text-amber-400',
}) => {
  return (
    <div className="bg-slate-900/40 border border-slate-800/40 rounded-2xl p-4 flex items-center gap-3.5 transition hover:bg-slate-900/60 hover:border-slate-800/70">
      {icon && (
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
          {icon}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <span className="text-xs sm:text-sm text-slate-300 font-semibold block truncate mb-0.5">{title}</span>
        <div className="flex items-baseline gap-2">
          <span dir="ltr" className="text-xl sm:text-2xl font-bold font-mono text-white tabular-nums tracking-tight">
            {value}
          </span>
          {subtitle && <span className="text-xs text-slate-400 font-medium">{subtitle}</span>}
        </div>
      </div>
    </div>
  );
};

// 5. Empty State
export interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction,
}) => {
  return (
    <div className="text-center py-10 px-4 max-w-md mx-auto">
      <div className="w-14 h-14 mx-auto mb-3.5 rounded-2xl bg-slate-800/80 text-amber-400 flex items-center justify-center border border-slate-700/60">
        {icon}
      </div>
      <h3 className="text-base font-bold text-slate-200 mb-1">{title}</h3>
      <p className="text-xs sm:text-sm text-slate-400 mb-4 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <Button variant="primary" size="md" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

// Re-export Phase 8 Standardized Feedback Suite
export * from './StateFeedback';

