export default function DashboardSkeleton() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Key Metrics
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col gap-2 min-h-[88px]">
            <span className="text-gray-500 text-sm">Total Subscribers</span>
            <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col gap-2 min-h-[88px]">
            <span className="text-gray-500 text-sm">Open Rate</span>
            <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col gap-2 min-h-[88px]">
            <span className="text-gray-500 text-sm">Click Rate</span>
            <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col gap-4 min-h-[210px]"
            >
              <div className="flex items-center gap-2">
                {/* Example icon placeholder, keep as static if you have an icon */}
                <div className="w-6 h-6 bg-gray-200 rounded" />
                <span className="font-semibold text-gray-900">
                  Campaign Title
                </span>
              </div>
              <div className="text-gray-500 text-sm">
                Subject Line:{" "}
                <span className="font-mono">[subject line here]</span>
              </div>
              <div className="flex gap-4">
                <div>
                  <span className="text-xs text-gray-400">Status:</span>
                  <span className="ml-1 text-gray-700">Sent</span>
                </div>
                <div>
                  <span className="text-xs text-gray-400">Recipients:</span>
                  <span className="ml-1 text-gray-700">
                    <span className="inline-block h-4 w-10 bg-gray-200 rounded animate-pulse align-middle" />
                  </span>
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 font-semibold mb-1">
                  A/B Test Performance
                </div>
                <div className="flex gap-6">
                  <div>
                    <span className="text-xs text-gray-400">Open Rate A:</span>
                    <span className="ml-1">
                      <span className="inline-block h-4 w-10 bg-gray-200 rounded animate-pulse align-middle" />
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400">Open Rate B:</span>
                    <span className="ml-1">
                      <span className="inline-block h-4 w-10 bg-gray-200 rounded animate-pulse align-middle" />
                    </span>
                  </div>
                </div>
                <div className="flex gap-6 mt-2">
                  <div>
                    <span className="text-xs text-gray-400">Clicks A:</span>
                    <span className="ml-1">
                      <span className="inline-block h-4 w-10 bg-gray-200 rounded animate-pulse align-middle" />
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400">Clicks B:</span>
                    <span className="ml-1">
                      <span className="inline-block h-4 w-10 bg-gray-200 rounded animate-pulse align-middle" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col gap-4 min-h-[180px]">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-200 rounded" />
              <span className="font-semibold text-gray-900">
                Performance Insights
              </span>
            </div>
            <div className="space-y-2 mt-2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-4 w-full bg-gray-200 rounded animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6 min-h-[200px] flex flex-col">
            <div className="text-gray-900 font-semibold mb-4">
              Performance Chart
            </div>
            <div className="flex-1 flex items-center">
              <div className="h-32 w-full bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
          {/* RecentActivity skeleton, keep static title */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 min-h-[120px] flex flex-col">
            <div className="text-gray-900 font-semibold mb-4">
              Recent Activity
            </div>
            <div className="space-y-2 flex-1 flex flex-col justify-center">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-4 w-full bg-gray-200 rounded animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
