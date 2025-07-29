"use client";
import Link from "next/link";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import CampaignCard from "@/components/CampaignCard";
import DashboardSkeleton from "../DashboardSkeleton";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export default function AllCampaignsPage() {
  const usersCampaigns = useQuery(api.campaigns.getCampaigns);

  if (usersCampaigns === undefined) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-8 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Campaigns</h1>
          <p className="mt-1 text-gray-600">
            Manage and monitor all your email campaigns
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {usersCampaigns.length === 0 ? (
          <div className="col-span-full">
            <div className="rounded-lg bg-gray-50 p-8 text-center">
              <h3 className="mb-2 text-lg font-medium text-gray-900">
                No campaigns yet
              </h3>
              <p className="mb-4 text-gray-600">
                Create your first AI-powered newsletter campaign
              </p>
              <Link
                href="/dashboard/create-campaign"
                className={cn(buttonVariants())}
              >
                Create Your First Campaign
              </Link>
            </div>
          </div>
        ) : (
          usersCampaigns.map((campaign) => (
            <Link
              key={campaign._id}
              href={`/dashboard/campaign/${campaign._id}`}
            >
              <CampaignCard campaign={campaign} />
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
