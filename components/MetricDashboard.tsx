import MetricCard from "./MetricCard";
import MailIcon from "./icons/MailIcon";
import AnalyticsIcon from "./icons/AnalyticsIcon";
import UsersIcon from "./icons/UsersIcon";
import TrendChart from "./TrendChart";

export default function MetricDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Campaigns */}
      <MetricCard
        title="Total Campaigns"
        value="23"
        trend="12%"
        isPositive={true}
        icon={<MailIcon className="w-6 h-6" />}
      />

      {/* Average Open Rate */}
      <MetricCard
        title="Avg. Open Rate"
        value="24.8%"
        trend="3.2%"
        isPositive={true}
        icon={<AnalyticsIcon className="w-6 h-6" />}
        chart={<TrendChart isPositive={true} />}
      />

      {/* Total Subscribers */}
      <MetricCard
        title="Total Subscribers"
        value="8,421"
        trend="18.1%"
        isPositive={true}
        icon={<UsersIcon className="w-6 h-6" />}
      />

      {/* A/B Uplift */}
      <MetricCard
        title="A/B Test Uplift"
        value="8.4%"
        trend="2.1%"
        isPositive={true}
        icon={<AnalyticsIcon className="w-6 h-6" />}
        chart={<TrendChart isPositive={true} />}
      />
    </div>
  );
}
