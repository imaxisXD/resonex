"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
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

  const getNavItemClasses = (isActive: boolean) => {
    const baseClasses =
      "flex items-center gap-3 p-3 py-2.5 rounded-lg cursor-pointer transition-all duration-75 ease-in-out";
    const activeClasses = "bg-highlight text-highlight-txt font-medium";
    const inactiveClasses =
      "text-gray-600 hover:bg-highlight hover:text-highlight-txt";

    return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
  };

  return (
    <div className="flex h-screen w-56 flex-col bg-gray-100">
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

      <nav className="flex-1 space-y-1 px-3">
        <Link
          href="/dashboard"
          className={getNavItemClasses(
            pathname === "/dashboard" ||
              (pathname === "/dashboard/" && !pathname.includes("/campaign")),
          )}
        >
          <DashboardIcon className="h-5 w-5" />
          <span className="text-sm">Dashboard</span>
        </Link>

        <div
          className={getNavItemClasses(
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
          <div className="mt-1 ml-4 flex flex-col gap-1 space-y-1">
            <Link
              href="/dashboard/campaigns"
              className={getNavItemClasses(pathname === "/dashboard/campaigns")}
            >
              <span className="text-sm">All Campaigns</span>
            </Link>
            <div
              className={getNavItemClasses(
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
              className={getNavItemClasses(
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
              className={getNavItemClasses(
                pathname.includes("/campaigns/sent"),
              )}
            >
              <span className="text-sm">Sent</span>
            </div>
          </div>
        )}

        <div className={getNavItemClasses(pathname.includes("/analytics"))}>
          <AnalyticsIcon className="h-5 w-5" />
          <span className="text-sm">Analytics</span>
        </div>

        <div
          className={getNavItemClasses(
            pathname.includes("/scheduling") || pathname.includes("/calendar"),
          )}
        >
          <CalendarIcon className="h-5 w-5" />
          <span className="text-sm">Scheduling</span>
        </div>

        <div className={getNavItemClasses(pathname.includes("/settings"))}>
          <SettingsIcon className="h-5 w-5" />
          <span className="text-sm">Settings</span>
        </div>
      </nav>
    </div>
  );
}
