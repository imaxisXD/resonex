interface MetricCardProps {
  title: string;
  value: string;
  trend: string;
  isPositive: boolean;
  icon?: React.ReactNode;
  chart?: React.ReactNode;
}

export default function MetricCard({
  title,
  value,
  trend,
  isPositive,
  icon,
  chart,
}: MetricCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        </div>
        {icon && (
          <div className="p-2 bg-gray-50 rounded-lg">
            <div className="text-gray-400">{icon}</div>
          </div>
        )}
      </div>

      <div className="flex items-end justify-between">
        <div>
          <div className="text-3xl font-bold text-gray-900 mb-2">{value}</div>
          <div className="flex items-center gap-2">
            <span
              className={`text-sm font-medium flex items-center gap-1`}
              style={{
                color: isPositive ? "#EE342F" : "#8D2676",
              }}
            >
              <span className="text-lg leading-none">
                {isPositive ? "↗" : "↘"}
              </span>
              {trend}
            </span>
            <span className="text-sm text-gray-500">vs last year</span>
          </div>
        </div>
        {chart && <div className="flex-shrink-0">{chart}</div>}
      </div>
    </div>
  );
}
