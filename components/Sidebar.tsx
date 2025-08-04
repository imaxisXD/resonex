"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import DashboardIcon from "./icons/DashboardIcon";
import MailIcon from "./icons/MailIcon";
import SettingsIcon from "./icons/SettingsIcon";
import Image from "next/image";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import { LogsIcon, PlusCircle } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const getNavItemClasses = (isActive: boolean) => {
    const baseClasses =
      "flex items-center gap-3 p-2.5 py-2.5 rounded-lg cursor-pointer transition-all duration-75 ease-in-out";
    const activeClasses = "bg-highlight text-highlight-txt font-medium";
    const inactiveClasses =
      "text-gray-600 hover:bg-highlight hover:text-highlight-txt";

    return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
  };

  return (
    <div className="flex h-screen w-60 flex-col bg-gray-100">
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

      <nav className="flex-1 space-y-1 pr-6 pl-4">
        <Link
          href="/dashboard/create-campaign"
          className={cn(buttonVariants(), "mb-5 h-9 w-full")}
        >
          <PlusCircle className="h-4 w-4" />
          Create Campaign
        </Link>
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

        <Link
          href="/dashboard/campaigns"
          className={getNavItemClasses(
            pathname.includes("/campaign") || pathname.includes("/campaigns"),
          )}
        >
          <div className="flex items-center gap-3">
            <MailIcon className="h-5 w-5" />
            <span className="text-sm">Campaigns</span>
          </div>
        </Link>

        <Link
          href="/dashboard/logs"
          className={getNavItemClasses(pathname.includes("/logs"))}
        >
          <LogsIcon className="h-5 w-5" />
          <span className="text-sm">Logs</span>
        </Link>

        <Link
          href="/dashboard/settings"
          className={getNavItemClasses(pathname.includes("/settings"))}
        >
          <SettingsIcon className="h-5 w-5" />
          <span className="text-sm">Settings</span>
        </Link>
      </nav>
    </div>
  );
}
