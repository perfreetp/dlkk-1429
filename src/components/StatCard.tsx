interface StatCardProps {
  title: string;
  value: number | string;
  unit?: string;
  icon: React.ReactNode;
  trend?: number;
  trendLabel?: string;
  color?: 'primary' | 'success' | 'warning' | 'danger';
}

const colorClasses = {
  primary: {
    bg: 'from-primary-500/20 to-primary-600/5',
    icon: 'bg-primary-500/20 text-primary-400',
    text: 'text-primary-300',
  },
  success: {
    bg: 'from-success-500/20 to-success-600/5',
    icon: 'bg-success-500/20 text-success-400',
    text: 'text-success-300',
  },
  warning: {
    bg: 'from-warning-500/20 to-warning-600/5',
    icon: 'bg-warning-500/20 text-warning-400',
    text: 'text-warning-300',
  },
  danger: {
    bg: 'from-danger-500/20 to-danger-600/5',
    icon: 'bg-danger-500/20 text-danger-400',
    text: 'text-danger-300',
  },
};

export default function StatCard({
  title,
  value,
  unit,
  icon,
  trend,
  trendLabel,
  color = 'primary',
}: StatCardProps) {
  const colors = colorClasses[color];

  return (
    <div
      className={`glass-card p-5 bg-gradient-to-br ${colors.bg} hover:scale-[1.02] transition-transform duration-300`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-gray-400 mb-1">{title}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-white tabular-nums">{value}</span>
            {unit && <span className="text-sm text-gray-400">{unit}</span>}
          </div>
        </div>
        <div className={`p-3 rounded-lg ${colors.icon}`}>
          {icon}
        </div>
      </div>

      {trend !== undefined && (
        <div className="flex items-center gap-2 text-sm">
          <span className={trend >= 0 ? 'text-success-400' : 'text-danger-400'}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
          {trendLabel && <span className="text-gray-500">{trendLabel}</span>}
        </div>
      )}
    </div>
  );
}
