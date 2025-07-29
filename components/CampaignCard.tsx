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

  // const getWinner = () => {
  //   if (campaign.openRateA && campaign.openRateB) {
  //     return campaign.openRateA > campaign.openRateB ? "A" : "B";
  //   }
  //   return null;
  // };

  const statusStyle = getStatusColor(campaign.status);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="mb-1 font-semibold text-gray-900">{campaign.title}</h3>
          <p className="text-sm text-gray-500">{campaign.category}</p>
        </div>
        <span
          className="rounded-full px-2 py-1 text-xs font-medium"
          style={statusStyle}
        >
          {campaign.status}
        </span>
      </div>

      <div className="flex items-center justify-between text-sm">
        {/* <span className="text-gray-500">
          {campaign.recipients.toLocaleString()} recipients
        </span> */}
        {campaign.scheduledTime && campaign.status === "scheduled" && (
          <span className="font-medium" style={{ color: "#8D2676" }}>
            {campaign.scheduledTime}
          </span>
        )}
      </div>
    </div>
  );
}
