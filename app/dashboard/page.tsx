"use client";
import Sidebar from "@/components/Sidebar";
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
  const userAnalytics = useQuery(api.events.getUserAnalytics, {
    timeframe: "30d",
  });

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
      recipients: campaign.recipients.length,
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
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Key Metrics
        </h2>
        <MetricDashboard analytics={userAnalytics} />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Campaigns
            </h2>
            <button
              className="text-sm font-medium hover:underline transition-colors"
              style={{ color: "#EE342F" }}
              onClick={() => router.push("/campaigns")}
            >
              View all campaigns
            </button>
          </div>

          {transformedCampaigns.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No campaigns yet
              </h3>
              <p className="text-gray-600 mb-4">
                Create your first AI-powered newsletter campaign
              </p>
              <Link href="/create-campaign" className={cn(buttonVariants())}>
                Create Your First Campaign
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Performance Insights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Best Performing Day
            </h3>
            <p className="text-3xl font-bold text-blue-700">Tuesday</p>
            <p className="text-sm text-blue-600 mt-1">
              {userAnalytics.averageOpenRate.toFixed(1)}% avg open rate
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
            <h3 className="text-lg font-semibold text-green-900 mb-2">
              Optimal Send Time
            </h3>
            <p className="text-3xl font-bold text-green-700">10:00 AM</p>
            <p className="text-sm text-green-600 mt-1">
              Peak engagement window
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
            <h3 className="text-lg font-semibold text-purple-900 mb-2">
              A/B Test Winner
            </h3>
            <p className="text-3xl font-bold text-purple-700">
              {userAnalytics.abTestUplift.toFixed(1)}%
            </p>
            <p className="text-sm text-purple-600 mt-1">
              Average uplift from testing
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
