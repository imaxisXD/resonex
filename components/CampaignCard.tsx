interface CampaignCardProps {
  campaign: {
    id: string;
    title: string;
    subjectLines: { A: string; B: string };
    status: "draft" | "scheduled" | "sent";
    recipients: number;
    openRateA?: number;
    openRateB?: number;
    scheduledTime?: string;
    category: string;
  };
}

export default function CampaignCard({ campaign }: CampaignCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return { backgroundColor: "#F3B01C20", color: "#F3B01C" };
      case "scheduled":
        return { backgroundColor: "#8D267620", color: "#8D2676" };
      case "sent":
        return { backgroundColor: "#EE342F20", color: "#EE342F" };
      default:
        return { backgroundColor: "#e5e7eb", color: "#6b7280" };
    }
  };

  const getWinner = () => {
    if (campaign.openRateA && campaign.openRateB) {
      return campaign.openRateA > campaign.openRateB ? "A" : "B";
    }
    return null;
  };

  const winner = getWinner();
  const statusStyle = getStatusColor(campaign.status);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900 mb-1">{campaign.title}</h3>
          <p className="text-sm text-gray-500">{campaign.category}</p>
        </div>
        <span
          className="px-2 py-1 rounded-full text-xs font-medium"
          style={statusStyle}
        >
          {campaign.status}
        </span>
      </div>

      {/* Subject Lines A/B */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-500">
              Subject A:
            </span>
            {winner === "A" && (
              <span
                className="text-xs px-1 py-0.5 rounded font-medium"
                style={{ backgroundColor: "#EE342F20", color: "#EE342F" }}
              >
                Winner
              </span>
            )}
          </div>
          {campaign.openRateA && (
            <span className="text-xs text-gray-500">
              {campaign.openRateA}% open
            </span>
          )}
        </div>
        <p className="text-sm text-gray-700 truncate">
          {campaign.subjectLines.A}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-500">
              Subject B:
            </span>
            {winner === "B" && (
              <span
                className="text-xs px-1 py-0.5 rounded font-medium"
                style={{ backgroundColor: "#EE342F20", color: "#EE342F" }}
              >
                Winner
              </span>
            )}
          </div>
          {campaign.openRateB && (
            <span className="text-xs text-gray-500">
              {campaign.openRateB}% open
            </span>
          )}
        </div>
        <p className="text-sm text-gray-700 truncate">
          {campaign.subjectLines.B}
        </p>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">
          {campaign.recipients.toLocaleString()} recipients
        </span>
        {campaign.scheduledTime && campaign.status === "scheduled" && (
          <span className="font-medium" style={{ color: "#8D2676" }}>
            {campaign.scheduledTime}
          </span>
        )}
      </div>
    </div>
  );
}
