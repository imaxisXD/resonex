"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "./ui/button";

export default function Header() {
  return (
    <header className="relative z-10 bg-gray-100 px-8 py-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
        </div>
        <Link
          href="/dashboard/create-campaign"
          className={cn(buttonVariants())}
        >
          Create Campaign
        </Link>
      </div>
    </header>
  );
}
