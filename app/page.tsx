"use client";

import Sidebar from "../components/Sidebar";
import MetricDashboard from "../components/MetricDashboard";
import CampaignCard from "../components/CampaignCard";
import QuickActions from "../components/QuickActions";
import RecentActivity from "../components/RecentActivity";
import PerformanceChart from "../components/PerformanceChart";

export default function Home() {
  // Mock campaign data
  const recentCampaigns = [
    {
      id: "1",
      title: "Weekly Fintech Digest #42",
      subjectLines: {
        A: "🚀 This week's top fintech trends you can't miss",
        B: "Breaking: Major fintech developments this week",
      },
      status: "sent" as const,
      recipients: 1234,
      openRateA: 28.5,
      openRateB: 22.1,
      category: "Weekly Newsletter",
    },
    {
      id: "2",
      title: "Q1 Product Updates",
      subjectLines: {
        A: "Exciting product updates coming your way!",
        B: "Q1 Product Roadmap: What's new and what's next",
      },
      status: "scheduled" as const,
      recipients: 2845,
      scheduledTime: "Tomorrow 10:00 AM",
      category: "Product Updates",
    },
    {
      id: "3",
      title: "Monthly Market Analysis",
      subjectLines: {
        A: "Market insights that matter to your business",
        B: "March market trends: Data you need to know",
      },
      status: "draft" as const,
      recipients: 1856,
      category: "Market Analysis",
    },
    {
      id: "4",
      title: "Holiday Special Newsletter",
      subjectLines: {
        A: "Special holiday offers just for you!",
        B: "Don't miss our exclusive holiday deals",
      },
      status: "sent" as const,
      recipients: 3421,
      openRateA: 31.2,
      openRateB: 35.8,
      category: "Promotional",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-gray-100 px-8 py-3 relative z-10 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
            </div>
            <button
              className="px-4 py-2 rounded-lg text-white font-medium transition-all hover:shadow-md"
              style={{
                background: "linear-gradient(135deg, #EE342F 0%, #8D2676 100%)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background =
                  "linear-gradient(135deg, #d63029 0%, #7a2268 100%)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background =
                  "linear-gradient(135deg, #EE342F 0%, #8D2676 100%)";
              }}
            >
              Create Campaign
            </button>
          </div>
        </header>

        {/* Content with rounded corners */}
        <main className="flex-1 bg-white rounded-tl-3xl p-8 relative overflow-auto border border-gray-300">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Metrics Dashboard */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Key Metrics
              </h2>
              <MetricDashboard />
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Campaigns - Takes 2 columns */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Recent Campaigns
                  </h2>
                  <button
                    className="text-sm font-medium hover:underline transition-colors"
                    style={{ color: "#EE342F" }}
                  >
                    View all campaigns
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {recentCampaigns.map((campaign) => (
                    <CampaignCard key={campaign.id} campaign={campaign} />
                  ))}
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <QuickActions />

                {/* A/B Test Performance */}
                <PerformanceChart />

                {/* Recent Activity */}
                <RecentActivity />
              </div>
            </div>

            {/* Performance Insights */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Performance Insights
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div
                  className="rounded-lg p-4"
                  style={{ backgroundColor: "#EE342F15" }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: "#EE342F" }}
                    ></div>
                    <span
                      className="text-sm font-medium"
                      style={{ color: "#EE342F" }}
                    >
                      Best Performing
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Campaigns sent on <strong>Tuesday 10 AM</strong> show 15%
                    higher open rates
                  </p>
                </div>

                <div
                  className="rounded-lg p-4"
                  style={{ backgroundColor: "#8D267615" }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: "#8D2676" }}
                    ></div>
                    <span
                      className="text-sm font-medium"
                      style={{ color: "#8D2676" }}
                    >
                      A/B Testing
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Subject lines with <strong>emojis</strong> have 8.4% higher
                    open rates on average
                  </p>
                </div>

                <div
                  className="rounded-lg p-4"
                  style={{ backgroundColor: "#F3B01C15" }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: "#F3B01C" }}
                    ></div>
                    <span
                      className="text-sm font-medium"
                      style={{ color: "#F3B01C" }}
                    >
                      Recommendation
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Consider sending your next <strong>Fintech Digest</strong>{" "}
                    on Tuesday for optimal engagement
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
