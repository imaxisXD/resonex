import PlusIcon from "./icons/PlusIcon";
import AnalyticsIcon from "./icons/AnalyticsIcon";
import CalendarIcon from "./icons/CalendarIcon";

interface QuickActionsProps {
  onCreateCampaign: () => void;
}

export default function QuickActions({ onCreateCampaign }: QuickActionsProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Quick Actions
      </h3>

      <div className="space-y-3">
        <button
          onClick={onCreateCampaign}
          className="w-full flex items-center gap-3 p-3 text-white rounded-lg transition-all hover:shadow-md font-medium"
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
          <PlusIcon className="w-5 h-5" />
          <span className="font-medium">Create New Campaign</span>
        </button>

        <button className="w-full flex items-center gap-3 p-3 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          <AnalyticsIcon className="w-5 h-5" />
          <span className="font-medium">View Analytics</span>
        </button>

        <button className="w-full flex items-center gap-3 p-3 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          <CalendarIcon className="w-5 h-5" />
          <span className="font-medium">Optimal Send Times</span>
        </button>
      </div>
    </div>
  );
}
