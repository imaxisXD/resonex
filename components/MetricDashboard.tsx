import MetricCard from "./MetricCard";
import MailIcon from "./icons/MailIcon";
import AnalyticsIcon from "./icons/AnalyticsIcon";
import UsersIcon from "./icons/UsersIcon";
import TrendChart from "./TrendChart";

interface Analytics {
  totalCampaigns: number;
  totalRecipients: number;
  averageOpenRate: number;
  averageClickRate: number;
  averageBounceRate: number;
  abTestUplift: number;
  recentActivity: Array<{
    campaignId: string;
    campaignTitle: string;
    type: string;
    timestamp: number;
    details: string;
  }>;
}

interface MetricDashboardProps {
  analytics: Analytics;
}

export default function MetricDashboard({ analytics }: MetricDashboardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Campaigns */}
      <MetricCard
        title="Total Campaigns"
        value={analytics.totalCampaigns.toString()}
        trend="12%"
        isPositive={true}
        icon={<MailIcon className="w-6 h-6" />}
      />

      {/* Average Open Rate */}
      <MetricCard
        title="Avg. Open Rate"
        value={`${analytics.averageOpenRate.toFixed(1)}%`}
        trend="3.2%"
        isPositive={analytics.averageOpenRate > 20}
        icon={<AnalyticsIcon className="w-6 h-6" />}
        chart={<TrendChart isPositive={analytics.averageOpenRate > 20} />}
      />

      {/* Total Subscribers */}
      <MetricCard
        title="Total Subscribers"
        value={analytics.totalRecipients.toLocaleString()}
        trend="18.1%"
        isPositive={true}
        icon={<UsersIcon className="w-6 h-6" />}
      />

      {/* A/B Uplift */}
      <MetricCard
        title="A/B Test Uplift"
        value={`${analytics.abTestUplift.toFixed(1)}%`}
        trend="2.1%"
        isPositive={analytics.abTestUplift > 0}
        icon={<AnalyticsIcon className="w-6 h-6" />}
        chart={<TrendChart isPositive={analytics.abTestUplift > 0} />}
      />
    </div>
  );
}
