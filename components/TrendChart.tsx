interface TrendChartProps {
  isPositive?: boolean;
}

export default function TrendChart({ isPositive = true }: TrendChartProps) {
  const strokeColor = isPositive ? "#EE342F" : "#8D2676";

  return (
    <div className="w-24 h-12">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 96 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2 40 C8 38, 16 35, 24 32 C32 29, 40 25, 48 20 C56 15, 64 12, 72 8 C80 4, 88 2, 94 6"
          stroke={strokeColor}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M2 40 C8 38, 16 35, 24 32 C32 29, 40 25, 48 20 C56 15, 64 12, 72 8 C80 4, 88 2, 94 6 L94 46 L2 46 Z"
          fill={`url(#gradient${isPositive ? "Positive" : "Negative"})`}
          fillOpacity="0.1"
        />
        <defs>
          <linearGradient
            id={`gradient${isPositive ? "Positive" : "Negative"}`}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.3" />
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
