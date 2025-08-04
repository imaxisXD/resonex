"use client";
import SettingsIcon from "@/components/icons/SettingsIcon";
import UserIcon from "@/components/icons/UserIcon";
import MailIcon from "@/components/icons/MailIcon";
import NotificationIcon from "@/components/icons/NotificationIcon";
import ShieldIcon from "@/components/icons/ShieldIcon";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 p-8 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="mt-1 text-gray-600">
            Manage your account preferences and application configuration
          </p>
        </div>
      </div>

      <div className="w-full rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
          <SettingsIcon className="h-8 w-8 text-indigo-600" />
        </div>
        <h3 className="mb-2 text-xl font-semibold text-gray-900">
          Settings Panel Coming Soon
        </h3>
        <p className="text-muted-foreground mx-auto mb-6 max-w-md">
          We&apos;re building a comprehensive settings dashboard to help you
          customize your experience and manage your account preferences.
        </p>
        <div className="flex items-center justify-center text-sm text-gray-500">
          <span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-indigo-500"></span>
          In Development
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-blue-100 p-2">
                <UserIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Profile Settings</CardTitle>
                <CardDescription>
                  Manage your personal information and preferences
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                <span className="text-sm text-gray-600">Personal Info</span>
                <span className="text-xs text-gray-400">Coming Soon</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                <span className="text-sm text-gray-600">Avatar Upload</span>
                <span className="text-xs text-gray-400">Coming Soon</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                <span className="text-sm text-gray-600">Timezone</span>
                <span className="text-xs text-gray-400">Coming Soon</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-green-100 p-2">
                <MailIcon className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Email Configuration</CardTitle>
                <CardDescription>
                  Configure SMTP settings and email preferences
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                <span className="text-sm text-gray-600">SMTP Settings</span>
                <span className="text-xs text-gray-400">Coming Soon</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                <span className="text-sm text-gray-600">Sender Name</span>
                <span className="text-xs text-gray-400">Coming Soon</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                <span className="text-sm text-gray-600">Reply-To Address</span>
                <span className="text-xs text-gray-400">Coming Soon</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-yellow-100 p-2">
                <NotificationIcon className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Notifications</CardTitle>
                <CardDescription>
                  Control how and when you receive notifications
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                <span className="text-sm text-gray-600">Email Alerts</span>
                <span className="text-xs text-gray-400">Coming Soon</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                <span className="text-sm text-gray-600">Campaign Updates</span>
                <span className="text-xs text-gray-400">Coming Soon</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                <span className="text-sm text-gray-600">System Alerts</span>
                <span className="text-xs text-gray-400">Coming Soon</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-red-100 p-2">
                <ShieldIcon className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Security</CardTitle>
                <CardDescription>
                  Manage your account security and privacy
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                <span className="text-sm text-gray-600">Password Change</span>
                <span className="text-xs text-gray-400">Coming Soon</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                <span className="text-sm text-gray-600">Two-Factor Auth</span>
                <span className="text-xs text-gray-400">Coming Soon</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                <span className="text-sm text-gray-600">API Keys</span>
                <span className="text-xs text-gray-400">Coming Soon</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-purple-100 p-2">
                <SettingsIcon className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Integrations</CardTitle>
                <CardDescription>
                  Connect with third-party services and APIs
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                <span className="text-sm text-gray-600">Webhook URLs</span>
                <span className="text-xs text-gray-400">Coming Soon</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                <span className="text-sm text-gray-600">External APIs</span>
                <span className="text-xs text-gray-400">Coming Soon</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                <span className="text-sm text-gray-600">Data Export</span>
                <span className="text-xs text-gray-400">Coming Soon</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-orange-100 p-2">
                <SettingsIcon className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Billing & Usage</CardTitle>
                <CardDescription>
                  Manage your subscription and usage limits
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                <span className="text-sm text-gray-600">Subscription Plan</span>
                <span className="text-xs text-gray-400">Coming Soon</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                <span className="text-sm text-gray-600">Usage Analytics</span>
                <span className="text-xs text-gray-400">Coming Soon</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                <span className="text-sm text-gray-600">Billing History</span>
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
              Comprehensive Control
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-gray-400"></div>
                Granular permission settings
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-gray-400"></div>
                Custom notification preferences
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-gray-400"></div>
                Advanced security options
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 font-medium text-gray-900">Easy Integration</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-gray-400"></div>
                One-click service connections
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-gray-400"></div>
                Automated data synchronization
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-gray-400"></div>
                Real-time configuration updates
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
