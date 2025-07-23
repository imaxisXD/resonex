interface ActivityItem {
  id: string;
  type: "campaign_sent" | "opened" | "clicked" | "bounced" | "campaign_created";
  campaignTitle: string;
  timestamp: string;
  details?: string;
}

export default function RecentActivity() {
  const activities: ActivityItem[] = [
    {
      id: "1",
      type: "campaign_sent",
      campaignTitle: "Weekly Fintech Digest #42",
      timestamp: "2 hours ago",
      details: "Sent to 1,234 subscribers",
    },
    {
      id: "2",
      type: "opened",
      campaignTitle: "Product Update March",
      timestamp: "4 hours ago",
      details: "Subject A winning with 28% open rate",
    },
    {
      id: "3",
      type: "campaign_created",
      campaignTitle: "Q1 Newsletter Summary",
      timestamp: "6 hours ago",
      details: "Draft created, pending review",
    },
    {
      id: "4",
      type: "clicked",
      campaignTitle: "Holiday Special Offers",
      timestamp: "1 day ago",
      details: "12% click-through rate",
    },
    {
      id: "5",
      type: "bounced",
      campaignTitle: "Weekly Fintech Digest #41",
      timestamp: "2 days ago",
      details: "2.1% bounce rate",
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "campaign_sent":
        return "📧";
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

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Recent Activity
      </h3>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3">
            <div className="text-lg">{getActivityIcon(activity.type)}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {activity.campaignTitle}
              </p>
              <p className={`text-sm ${getActivityColor(activity.type)}`}>
                {activity.details}
              </p>
              <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
        View all activity
      </button>
    </div>
  );
}
