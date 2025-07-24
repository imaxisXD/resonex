interface Campaign {
  id: string;
  title: string;
  subjectLines: {
    A: string;
    B: string;
  };
  status: "draft" | "scheduled" | "sent";
  recipients: number;
  openRateA?: number;
  openRateB?: number;
  scheduledTime?: string;
  category: string;
}

interface PerformanceChartProps {
  campaigns: Campaign[];
}

export default function PerformanceChart({ campaigns }: PerformanceChartProps) {
  // Find the best performing sent campaign for display
  const sentCampaigns = campaigns.filter(
    (c) => c.status === "sent" && c.openRateA && c.openRateB,
  );
  const bestCampaign =
    sentCampaigns.length > 0
      ? sentCampaigns.reduce((best, current) => {
          const bestMax = Math.max(best.openRateA || 0, best.openRateB || 0);
          const currentMax = Math.max(
            current.openRateA || 0,
            current.openRateB || 0,
          );
          return currentMax > bestMax ? current : best;
        })
      : null;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        A/B Test Performance
      </h3>

      {!bestCampaign ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-2">No A/B test results yet</p>
          <p className="text-xs text-gray-400">
            Send a campaign to see performance data
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-sm text-gray-600 mb-3">
            Best performing campaign:{" "}
            <span className="font-medium">{bestCampaign.title}</span>
          </div>

          {/* Subject Line A */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Subject A
              </span>
              <span className="text-sm font-semibold text-gray-900">
                {bestCampaign.openRateA?.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${bestCampaign.openRateA}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 truncate">
              {bestCampaign.subjectLines.A}
            </p>
          </div>

          {/* Subject Line B */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Subject B
              </span>
              <span className="text-sm font-semibold text-gray-900">
                {bestCampaign.openRateB?.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${bestCampaign.openRateB}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 truncate">
              {bestCampaign.subjectLines.B}
            </p>
          </div>

          {/* Winner indicator */}
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-green-600 font-semibold">🏆 Winner:</span>
              <span className="text-sm font-medium text-green-800">
                Subject{" "}
                {(bestCampaign.openRateA || 0) > (bestCampaign.openRateB || 0)
                  ? "A"
                  : "B"}
              </span>
            </div>
            <p className="text-xs text-green-600 mt-1">
              {Math.abs(
                (bestCampaign.openRateA || 0) - (bestCampaign.openRateB || 0),
              ).toFixed(1)}
              % higher open rate
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
