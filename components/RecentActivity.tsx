interface ActivityItem {
  campaignId: string;
  campaignTitle: string;
  type: string;
  timestamp: number;
  details: string;
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "campaign_sent":
        return "📧";
      case "campaign_scheduled":
        return "⏰";
      case "opened":
        return "👁️";
      case "clicked":
        return "🔗";
      case "bounced":
        return "⚠️";
      case "campaign_created":
        return "✏️";
      default:
        return "📋";
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "campaign_sent":
        return "text-blue-600";
      case "campaign_scheduled":
        return "text-purple-600";
      case "opened":
        return "text-green-600";
      case "clicked":
        return "text-purple-600";
      case "bounced":
        return "text-red-600";
      case "campaign_created":
        return "text-orange-600";
      default:
        return "text-gray-600";
    }
  };

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Recent Activity
      </h3>

      {activities.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No recent activity</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div
              key={`${activity.campaignId}-${index}`}
              className="flex items-start gap-3"
            >
              <div className="text-lg">{getActivityIcon(activity.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {activity.campaignTitle}
                  </p>
                  <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                    {formatTimeAgo(activity.timestamp)}
                  </span>
                </div>
                <p className={`text-sm ${getActivityColor(activity.type)}`}>
                  {activity.details}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
