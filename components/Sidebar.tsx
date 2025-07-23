"use client";

import { useState } from "react";
import DashboardIcon from "./icons/DashboardIcon";
import MailIcon from "./icons/MailIcon";
import AnalyticsIcon from "./icons/AnalyticsIcon";
import CalendarIcon from "./icons/CalendarIcon";
import SettingsIcon from "./icons/SettingsIcon";
import ChevronDownIcon from "./icons/ChevronDownIcon";

export default function Sidebar() {
  const [isCampaignsOpen, setIsCampaignsOpen] = useState(true);

  return (
    <div className="w-64 h-screen bg-gray-100 flex flex-col">
      {/* Logo */}
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 bg-gradient-to-br from-red-500 to-purple-600 rounded-lg flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #EE342F 0%, #8D2676 100%)",
            }}
          >
            <span className="text-white font-bold text-lg">R</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              <span style={{ color: "#EE342F" }}>Reson</span>
              <span style={{ color: "#8D2676" }}>ex</span>
            </h1>
            <p className="text-xs text-gray-500">Powered by Convex × Resend</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2">
        {/* Dashboard */}
        <div
          className="flex items-center gap-3 p-3 rounded-lg transition-colors"
          style={{ backgroundColor: "#EE342F15", color: "#EE342F" }}
        >
          <DashboardIcon className="w-5 h-5" />
          <span className="text-sm font-medium">Dashboard</span>
        </div>
        {/* Campaigns */}
        <div
          className="flex items-center justify-between p-3 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
          onClick={() => setIsCampaignsOpen(!isCampaignsOpen)}
        >
          <div className="flex items-center gap-3">
            <MailIcon className="w-5 h-5" />
            <span className="text-sm font-medium">Campaigns</span>
          </div>
          <ChevronDownIcon
            className={`w-4 h-4 transition-transform ${
              isCampaignsOpen ? "rotate-180" : ""
            }`}
          />
        </div>
        {isCampaignsOpen && (
          <div className="mt-2 ml-8 space-y-1">
            <div className="flex items-center justify-between p-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
              <span className="text-sm">All Campaigns</span>
            </div>
            <div className="flex items-center justify-between p-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
              <span className="text-sm">Drafts</span>
              <span
                className="text-xs px-2 py-1 rounded-full font-medium"
                style={{ backgroundColor: "#F3B01C20", color: "#F3B01C" }}
              >
                2
              </span>
            </div>
            <div className="flex items-center justify-between p-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
              <span className="text-sm">Scheduled</span>
              <span
                className="text-xs px-2 py-1 rounded-full font-medium"
                style={{ backgroundColor: "#8D267620", color: "#8D2676" }}
              >
                3
              </span>
            </div>
            <div className="flex items-center p-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
              <span className="text-sm">Sent</span>
            </div>
          </div>
        )}
        {/* Analytics */}
        <div className="flex items-center gap-3 p-3 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
          <AnalyticsIcon className="w-5 h-5" />
          <span className="text-sm font-medium">Analytics</span>
        </div>
        {/* Calendar */}
        <div className="flex items-center gap-3 p-3 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
          <CalendarIcon className="w-5 h-5" />
          <span className="text-sm font-medium">Scheduling</span>
        </div>
        {/* Settings */}
        <div className="flex items-center gap-3 p-3 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
          <SettingsIcon className="w-5 h-5" />
          <span className="text-sm font-medium">Settings</span>
        </div>
      </nav>
    </div>
  );
}
