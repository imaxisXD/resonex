import { Doc } from "@/convex/_generated/dataModel";

interface CampaignCardProps {
  campaign: Doc<"campaigns">;
}

export default function CampaignCard({ campaign }: CampaignCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return { backgroundColor: "#FEF3C7", color: "#D97706" };
      case "scheduled":
        return { backgroundColor: "#FCE7F3", color: "#BE185D" };
      case "sent":
        return { backgroundColor: "#FEE2E2", color: "#DC2626" };
      default:
        return { backgroundColor: "#F3F4F6", color: "#6B7280" };
    }
  };

  const statusStyle = getStatusColor(campaign.status);

  const getEmailCount = () => {
    if (campaign.emailIds) {
      return campaign.emailIds.length;
    }
    if (campaign.resendEmailIds) {
      return (
        (campaign.resendEmailIds.A?.length || 0) +
        (campaign.resendEmailIds.B?.length || 0)
      );
    }
    return 0;
  };

  const emailCount = getEmailCount();

  return (
    <div className="rounded-lg border border-slate-200 bg-gradient-to-b from-slate-50 to-gray-50 p-6 transition-shadow hover:shadow-md">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="mb-1 font-semibold text-gray-900">
            {campaign.campaignName}
          </h3>
          <p className="text-sm text-gray-500">{campaign.category}</p>
        </div>
        <span
          className="rounded-full border px-4 py-0.5 text-xs"
          style={{
            backgroundColor: statusStyle.backgroundColor,
            color: statusStyle.color,
          }}
        >
          {campaign.status}
        </span>
      </div>

      <div className="flex items-center justify-between text-sm">
        <button className="group relative inline-block cursor-pointer rounded-full bg-slate-800 p-px text-xs leading-5 font-semibold text-white no-underline">
          <span className="absolute inset-0 overflow-hidden rounded-full">
            <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </span>
          <div className="relative z-10 flex items-center space-x-2 rounded-full bg-zinc-950 px-4 py-0.5 ring-1 ring-white/10">
            <div className="size-2 rounded-full bg-yellow-500" />
            <span>A/B Test: ({emailCount} emails)</span>
          </div>
          <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40" />
        </button>
      </div>
    </div>
  );
}
