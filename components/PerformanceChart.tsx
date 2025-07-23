interface ABTestData {
  campaignName: string;
  subjectA: string;
  subjectB: string;
  openRateA: number;
  openRateB: number;
  winner: "A" | "B";
}

export default function PerformanceChart() {
  const abTestData: ABTestData[] = [
    {
      campaignName: "Weekly Fintech #42",
      subjectA: "🚀 Top fintech trends",
      subjectB: "Breaking fintech news",
      openRateA: 28.5,
      openRateB: 22.1,
      winner: "A",
    },
    {
      campaignName: "Holiday Special",
      subjectA: "Special offers for you!",
      subjectB: "Exclusive holiday deals",
      openRateA: 31.2,
      openRateB: 35.8,
      winner: "B",
    },
    {
      campaignName: "Product Update",
      subjectA: "New features released",
      subjectB: "What's new this month",
      openRateA: 26.3,
      openRateB: 24.7,
      winner: "A",
    },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        A/B Test Performance
      </h3>

      <div className="space-y-6">
        {abTestData.map((test, index) => (
          <div
            key={index}
            className="border-b border-gray-100 pb-4 last:border-b-0"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">{test.campaignName}</h4>
              <span className="text-xs text-gray-500">A/B Test Results</span>
            </div>

            <div className="space-y-3">
              {/* Subject A */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-600">
                      A:
                    </span>
                    {test.winner === "A" && (
                      <span
                        className="text-xs px-1 py-0.5 rounded font-medium"
                        style={{
                          backgroundColor: "#EE342F20",
                          color: "#EE342F",
                        }}
                      >
                        Winner
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {test.openRateA}%
                  </span>
                </div>
                <p className="text-sm text-gray-600 truncate mb-2">
                  {test.subjectA}
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${(test.openRateA / 40) * 100}%`,
                      backgroundColor:
                        test.winner === "A" ? "#EE342F" : "#8D2676",
                    }}
                  ></div>
                </div>
              </div>

              {/* Subject B */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-600">
                      B:
                    </span>
                    {test.winner === "B" && (
                      <span
                        className="text-xs px-1 py-0.5 rounded font-medium"
                        style={{
                          backgroundColor: "#EE342F20",
                          color: "#EE342F",
                        }}
                      >
                        Winner
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {test.openRateB}%
                  </span>
                </div>
                <p className="text-sm text-gray-600 truncate mb-2">
                  {test.subjectB}
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${(test.openRateB / 40) * 100}%`,
                      backgroundColor:
                        test.winner === "B" ? "#EE342F" : "#8D2676",
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        className="w-full mt-4 text-sm font-medium hover:underline transition-colors"
        style={{ color: "#EE342F" }}
      >
        View detailed analytics
      </button>
    </div>
  );
}
