"use client";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import DashboardSkeleton from "./DashboardSkeleton";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import CampaignCard from "@/components/CampaignCard";

export default function Dashboard() {
  const campaigns = useQuery(api.campaigns.getCampaigns, {});

  if (campaigns === undefined) {
    return <DashboardSkeleton />;
  }
  return (
    <div className="mx-auto max-w-7xl space-y-8 pt-16 pb-5 pl-4">
      <div className="w-full rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center">
        <h3 className="mb-2 text-lg font-medium">No campaigns yet</h3>
        <p className="text-muted-foreground mb-4">
          Create your first AI-powered email campaign
        </p>
        <Link
          href="/dashboard/create-campaign"
          className={cn(buttonVariants())}
        >
          Create Your First Campaign
        </Link>
      </div>
      {/* <div>
        <Image
          src="/owl.webp"
          alt="Dashboard Hero"
          width={600}
          height={600}
          className="mx-auto opacity-80"
        />
        <h1 className="text-muted-foreground text-center text-2xl font-semibold">
          Go fast and test your ideas
        </h1>
      </div> */}
      {/* {campaigns.length > 0 && (
        <div>
          <h2 className="mb-6 text-lg font-semibold text-gray-900">
            Key Metrics
          </h2>
          {/* <MetricDashboard analytics={userAnalytics} /> */}
      {/* </div> */}

      {/* Main Grid */}
      <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {campaigns.length > 0 && (
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Campaigns
              </h2>
              <Link
                href="/dashboard/campaigns"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "text-sm",
                )}
              >
                View all campaigns
              </Link>
            </div>
          )}

          {campaigns.length > 0 && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {campaigns.map((campaign) => (
                <CampaignCard key={campaign._id} campaign={campaign} />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          {/* <PerformanceChart campaigns={transformedCampaigns} />
          <RecentActivity activities={userAnalytics.recentActivity} /> */}
        </div>
      </div>

      {/* <div>
        <h2 className="mb-6 text-lg font-semibold text-gray-900">
          Performance Insights
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-lg border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-6">
            <h3 className="mb-2 text-lg font-semibold text-blue-900">
              Best Performing Day
            </h3>
            <p className="text-3xl font-bold text-blue-700">Tuesday</p>
            <p className="mt-1 text-sm text-blue-600"></p>
          </div>
          <div className="rounded-lg border border-green-200 bg-gradient-to-br from-green-50 to-green-100 p-6">
            <h3 className="mb-2 text-lg font-semibold text-green-900">
              Optimal Send Time
            </h3>
            <p className="text-3xl font-bold text-green-700">10:00 AM</p>
            <p className="mt-1 text-sm text-green-600">
              Peak engagement window
            </p>
          </div>
          <div className="rounded-lg border border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 p-6">
            <h3 className="mb-2 text-lg font-semibold text-purple-900">
              A/B Test Winner
            </h3>
            <p className="text-3xl font-bold text-purple-700"></p>
            <p className="mt-1 text-sm text-purple-600">
              Average uplift from testing
            </p>
          </div>
        </div>
      </div> */}
    </div>
  );
}
