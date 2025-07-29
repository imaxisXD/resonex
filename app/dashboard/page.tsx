"use client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import MetricDashboard from "@/components/MetricDashboard";
import CampaignCard from "@/components/CampaignCard";
import PerformanceChart from "@/components/PerformanceChart";
import RecentActivity from "@/components/RecentActivity";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import DashboardSkeleton from "./DashboardSkeleton";

export default function Dashboard() {
  const router = useRouter();

  // Fetch real data from Convex
  const campaigns = useQuery(api.campaigns.getCampaigns, {});
  const userAnalytics = undefined;

  // Loading states
  if (campaigns === undefined || userAnalytics === undefined) {
    return <DashboardSkeleton />;
  }

  // Transform campaigns data for CampaignCard component
  const transformedCampaigns = campaigns.slice(0, 4).map((campaign) => {
    // Calculate analytics for sent campaigns
    let openRateA = 0,
      openRateB = 0;

    if (campaign.status === "sent") {
      // Note: In a real implementation, you'd fetch campaign-specific analytics
      // For now, using placeholder values
      openRateA = Math.random() * 40 + 10; // 10-50%
      openRateB = Math.random() * 40 + 10; // 10-50%
    }

    return {
      id: campaign._id,
      title:
        campaign.prompt.slice(0, 50) +
        (campaign.prompt.length > 50 ? "..." : ""),
      subjectLines: campaign.subjectLines,
      status: campaign.status,
      recipients: campaign.recipients?.length || 0,
      openRateA: campaign.status === "sent" ? openRateA : undefined,
      openRateB: campaign.status === "sent" ? openRateB : undefined,
      scheduledTime:
        campaign.status === "scheduled" && campaign.sendTimeA
          ? new Date(campaign.sendTimeA).toLocaleDateString() +
            " " +
            new Date(campaign.sendTimeA).toLocaleTimeString()
          : undefined,
      category: campaign.category,
    };
  });

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-8 pb-10">
      <div>
        <h2 className="mb-6 text-lg font-semibold text-gray-900">
          Key Metrics
        </h2>
        <MetricDashboard analytics={userAnalytics} />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Campaigns
            </h2>
            <button
              className="text-sm font-medium transition-colors hover:underline"
              style={{ color: "#EE342F" }}
              onClick={() => router.push("/campaigns")}
            >
              View all campaigns
            </button>
          </div>

          {transformedCampaigns.length === 0 ? (
            <div className="rounded-lg bg-gray-50 p-8 text-center">
              <h3 className="mb-2 text-lg font-medium text-gray-900">
                No campaigns yet
              </h3>
              <p className="mb-4 text-gray-600">
                Create your first AI-powered newsletter campaign
              </p>
              <Link href="/create-campaign" className={cn(buttonVariants())}>
                Create Your First Campaign
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {transformedCampaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <PerformanceChart campaigns={transformedCampaigns} />
          <RecentActivity activities={userAnalytics.recentActivity} />
        </div>
      </div>

      <div>
        <h2 className="mb-6 text-lg font-semibold text-gray-900">
          Performance Insights
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-lg border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-6">
            <h3 className="mb-2 text-lg font-semibold text-blue-900">
              Best Performing Day
            </h3>
            <p className="text-3xl font-bold text-blue-700">Tuesday</p>
            <p className="mt-1 text-sm text-blue-600">
              {userAnalytics.averageOpenRate.toFixed(1)}% avg open rate
            </p>
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
            <p className="text-3xl font-bold text-purple-700">
              {userAnalytics.abTestUplift.toFixed(1)}%
            </p>
            <p className="mt-1 text-sm text-purple-600">
              Average uplift from testing
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
