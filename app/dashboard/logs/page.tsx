"use client";
import LogsIcon from "@/components/icons/LogsIcon";
import AnalyticsIcon from "@/components/icons/AnalyticsIcon";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LogsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 p-8 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Activity Logs</h1>
          <p className="mt-1 text-gray-600">
            Track and monitor all campaign activities and system events
          </p>
        </div>
      </div>

      <div className="w-full rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
          <LogsIcon className="h-8 w-8 text-blue-600" />
        </div>
        <h3 className="mb-2 text-xl font-semibold text-gray-900">
          Activity Logs Coming Soon
        </h3>
        <p className="text-muted-foreground mx-auto mb-6 max-w-md">
          We&apos;re building comprehensive activity logging to help you track
          campaign performance, user actions, and system events in real-time.
        </p>
        <div className="flex items-center justify-center text-sm text-gray-500">
          <span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-blue-500"></span>
          In Development
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-green-100 p-2">
                <AnalyticsIcon className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Campaign Events</CardTitle>
                <CardDescription>
                  Track email sends, opens, and clicks
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                <span className="text-sm text-gray-600">Email Sent</span>
                <span className="text-xs text-gray-400">Coming Soon</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                <span className="text-sm text-gray-600">Email Opened</span>
                <span className="text-xs text-gray-400">Coming Soon</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                <span className="text-sm text-gray-600">Link Clicked</span>
                <span className="text-xs text-gray-400">Coming Soon</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-blue-100 p-2">
                <LogsIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-lg">System Logs</CardTitle>
                <CardDescription>
                  Monitor system events and errors
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                <span className="text-sm text-gray-600">API Requests</span>
                <span className="text-xs text-gray-400">Coming Soon</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                <span className="text-sm text-gray-600">Error Events</span>
                <span className="text-xs text-gray-400">Coming Soon</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                <span className="text-sm text-gray-600">User Actions</span>
                <span className="text-xs text-gray-400">Coming Soon</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-purple-100 p-2">
                <AnalyticsIcon className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-lg">A/B Test Logs</CardTitle>
                <CardDescription>
                  Track split testing activities
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                <span className="text-sm text-gray-600">Test Started</span>
                <span className="text-xs text-gray-400">Coming Soon</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                <span className="text-sm text-gray-600">Variant Shown</span>
                <span className="text-xs text-gray-400">Coming Soon</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                <span className="text-sm text-gray-600">Test Completed</span>
                <span className="text-xs text-gray-400">Coming Soon</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          What to Expect
        </h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <h4 className="mb-3 font-medium text-gray-900">
              Real-time Monitoring
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-gray-400"></div>
                Live activity feeds
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-gray-400"></div>
                Instant notifications
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-gray-400"></div>
                Performance metrics
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 font-medium text-gray-900">
              Advanced Filtering
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-gray-400"></div>
                Filter by campaign
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-gray-400"></div>
                Date range selection
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-gray-400"></div>
                Event type filtering
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
