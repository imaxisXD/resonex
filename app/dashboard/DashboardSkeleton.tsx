export default function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 pt-16 pb-10 pl-4">
      <div>
        <h2 className="mb-6 text-lg font-semibold text-gray-900">
          Key Metrics
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex min-h-[88px] flex-col gap-2 rounded-lg border border-gray-200 bg-white p-6">
            <span className="text-sm text-gray-500">Total Subscribers</span>
            <div className="h-8 w-24 animate-pulse rounded bg-gray-200" />
          </div>
          <div className="flex min-h-[88px] flex-col gap-2 rounded-lg border border-gray-200 bg-white p-6">
            <span className="text-sm text-gray-500">Open Rate</span>
            <div className="h-8 w-24 animate-pulse rounded bg-gray-200" />
          </div>
          <div className="flex min-h-[88px] flex-col gap-2 rounded-lg border border-gray-200 bg-white p-6">
            <span className="text-sm text-gray-500">Click Rate</span>
            <div className="h-8 w-24 animate-pulse rounded bg-gray-200" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="flex min-h-[210px] flex-col gap-4 rounded-lg border border-gray-200 bg-white p-6"
            >
              <div className="flex items-center gap-2">
                {/* Example icon placeholder, keep as static if you have an icon */}
                <div className="h-6 w-6 rounded bg-gray-200" />
                <span className="font-semibold text-gray-900">
                  Campaign Title
                </span>
              </div>
              <div className="text-sm text-gray-500">
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
                    <span className="inline-block h-4 w-10 animate-pulse rounded bg-gray-200 align-middle" />
                  </span>
                </div>
              </div>
              <div>
                <div className="mb-1 text-xs font-semibold text-gray-500">
                  A/B Test Performance
                </div>
                <div className="flex gap-6">
                  <div>
                    <span className="text-xs text-gray-400">Open Rate A:</span>
                    <span className="ml-1">
                      <span className="inline-block h-4 w-10 animate-pulse rounded bg-gray-200 align-middle" />
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400">Open Rate B:</span>
                    <span className="ml-1">
                      <span className="inline-block h-4 w-10 animate-pulse rounded bg-gray-200 align-middle" />
                    </span>
                  </div>
                </div>
                <div className="mt-2 flex gap-6">
                  <div>
                    <span className="text-xs text-gray-400">Clicks A:</span>
                    <span className="ml-1">
                      <span className="inline-block h-4 w-10 animate-pulse rounded bg-gray-200 align-middle" />
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400">Clicks B:</span>
                    <span className="ml-1">
                      <span className="inline-block h-4 w-10 animate-pulse rounded bg-gray-200 align-middle" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className="flex min-h-[180px] flex-col gap-4 rounded-lg border border-gray-200 bg-white p-6">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-gray-200" />
              <span className="font-semibold text-gray-900">
                Performance Insights
              </span>
            </div>
            <div className="mt-2 space-y-2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-4 w-full animate-pulse rounded bg-gray-200"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex min-h-[200px] flex-col rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-4 font-semibold text-gray-900">
              Performance Chart
            </div>
            <div className="flex flex-1 items-center">
              <div className="h-32 w-full animate-pulse rounded bg-gray-200" />
            </div>
          </div>
          {/* RecentActivity skeleton, keep static title */}
          <div className="flex min-h-[120px] flex-col rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-4 font-semibold text-gray-900">
              Recent Activity
            </div>
            <div className="flex flex-1 flex-col justify-center space-y-2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-4 w-full animate-pulse rounded bg-gray-200"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
