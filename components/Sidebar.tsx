"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import DashboardIcon from "./icons/DashboardIcon";
import MailIcon from "./icons/MailIcon";
import AnalyticsIcon from "./icons/AnalyticsIcon";
import CalendarIcon from "./icons/CalendarIcon";
import SettingsIcon from "./icons/SettingsIcon";
import ChevronDownIcon from "./icons/ChevronDownIcon";
import Image from "next/image";

export default function Sidebar() {
  const [isCampaignsOpen, setIsCampaignsOpen] = useState(true);
  const pathname = usePathname();

  // Helper function to generate navigation item classes
  const getNavItemClasses = (isActive: boolean) => {
    const baseClasses =
      "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors";
    const activeClasses = "bg-highlight text-highlight-txt font-medium";
    const inactiveClasses =
      "text-gray-600 hover:bg-highlight hover:text-highlight-txt";

    return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
  };

  // Helper function for sub-navigation items
  const getSubNavItemClasses = (isActive: boolean) => {
    const baseClasses =
      "flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors";
    const activeClasses = "bg-blue-50 text-blue-600";
    const inactiveClasses = "text-gray-600 hover:bg-gray-50";

    return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
  };

  // Helper function for campaigns dropdown
  const getCampaignsDropdownClasses = (isActive: boolean) => {
    const baseClasses =
      "flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors";
    const activeClasses = "bg-blue-50 text-blue-600";
    const inactiveClasses = "text-gray-600 hover:bg-gray-50";

    return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
  };

  // Helper function for simple sub-navigation items (without justify-between)
  const getSimpleSubNavItemClasses = (isActive: boolean) => {
    const baseClasses =
      "flex items-center p-2 rounded-lg cursor-pointer transition-colors";
    const activeClasses = "bg-blue-50 text-blue-600";
    const inactiveClasses = "text-gray-600 hover:bg-gray-50";

    return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
  };

  return (
    <div className="flex h-screen w-64 flex-col bg-gray-100">
      <div className="p-6 py-4 pb-7">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-center gap-1">
            <Image
              src="/resonex-logo.webp"
              alt="Resonex"
              width={36}
              height={36}
            />
            <Image
              src="/resonex-txt.webp"
              alt="Resonex"
              width={100}
              height={100}
            />
          </div>
          <p className="text-center text-xs text-gray-500">
            Powered by Convex × Resend
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 px-4">
        {/* Dashboard */}
        <div
          className={getNavItemClasses(
            pathname === "/dashboard" || pathname.startsWith("/dashboard"),
          )}
        >
          <DashboardIcon className="h-5 w-5" />
          <span className="text-sm">Dashboard</span>
        </div>
        {/* Campaigns */}
        <div
          className={getCampaignsDropdownClasses(
            pathname.includes("/campaign") || pathname.includes("/campaigns"),
          )}
          onClick={() => setIsCampaignsOpen(!isCampaignsOpen)}
        >
          <div className="flex items-center gap-3">
            <MailIcon className="h-5 w-5" />
            <span className="text-sm">Campaigns</span>
          </div>
          <ChevronDownIcon
            className={`h-4 w-4 transition-transform ${
              isCampaignsOpen ? "rotate-180" : ""
            }`}
          />
        </div>
        {isCampaignsOpen && (
          <div className="mt-2 ml-8 space-y-1">
            <div
              className={getSubNavItemClasses(
                pathname.includes("/campaigns/all"),
              )}
            >
              <span className="text-sm">All Campaigns</span>
            </div>
            <div
              className={getSubNavItemClasses(
                pathname.includes("/campaigns/drafts"),
              )}
            >
              <span className="text-sm">Drafts</span>
              <span
                className="rounded-full px-2 py-1 text-xs font-medium"
                style={{ backgroundColor: "#F3B01C20", color: "#F3B01C" }}
              >
                2
              </span>
            </div>
            <div
              className={getSubNavItemClasses(
                pathname.includes("/campaigns/scheduled"),
              )}
            >
              <span className="text-sm">Scheduled</span>
              <span
                className="rounded-full px-2 py-1 text-xs font-medium"
                style={{ backgroundColor: "#8D267620", color: "#8D2676" }}
              >
                3
              </span>
            </div>
            <div
              className={getSimpleSubNavItemClasses(
                pathname.includes("/campaigns/sent"),
              )}
            >
              <span className="text-sm">Sent</span>
            </div>
          </div>
        )}
        {/* Analytics */}
        <div className={getNavItemClasses(pathname.includes("/analytics"))}>
          <AnalyticsIcon className="h-5 w-5" />
          <span className="text-sm">Analytics</span>
        </div>
        {/* Calendar */}
        <div
          className={getNavItemClasses(
            pathname.includes("/scheduling") || pathname.includes("/calendar"),
          )}
        >
          <CalendarIcon className="h-5 w-5" />
          <span className="text-sm">Scheduling</span>
        </div>
        {/* Settings */}
        <div className={getNavItemClasses(pathname.includes("/settings"))}>
          <SettingsIcon className="h-5 w-5" />
          <span className="text-sm">Settings</span>
        </div>
      </nav>
    </div>
  );
}
