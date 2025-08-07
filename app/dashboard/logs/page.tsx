"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

interface LogEntry {
  id: string;
  endpoint: string;
  status: "delivered" | "scheduled" | "sent" | "failed" | "opened" | "clicked";
  method: string;
  createdAt: string;
  campaignName: string;
  variant: "A" | "B";
}

const mockLogs: LogEntry[] = [
  {
    id: "1",
    endpoint: "/emails/batch",
    status: "delivered",
    method: "POST",
    createdAt: "1 day ago",
    campaignName: "Summer Sale Campaign",
    variant: "A",
  },
  {
    id: "2",
    endpoint: "/emails/batch",
    status: "scheduled",
    method: "POST",
    createdAt: "1 day ago",
    campaignName: "Summer Sale Campaign",
    variant: "B",
  },
  {
    id: "3",
    endpoint: "/emails/batch",
    status: "sent",
    method: "POST",
    createdAt: "2 days ago",
    campaignName: "Newsletter Weekly",
    variant: "A",
  },
  {
    id: "4",
    endpoint: "/emails/batch",
    status: "opened",
    method: "POST",
    createdAt: "2 days ago",
    campaignName: "Newsletter Weekly",
    variant: "B",
  },
  {
    id: "5",
    endpoint: "/emails/batch",
    status: "clicked",
    method: "POST",
    createdAt: "2 days ago",
    campaignName: "Product Launch",
    variant: "A",
  },
  {
    id: "6",
    endpoint: "/emails/batch",
    status: "failed",
    method: "POST",
    createdAt: "3 days ago",
    campaignName: "Product Launch",
    variant: "B",
  },
  {
    id: "7",
    endpoint: "/emails/batch",
    status: "delivered",
    method: "POST",
    createdAt: "4 days ago",
    campaignName: "Welcome Series",
    variant: "A",
  },
  {
    id: "8",
    endpoint: "/emails",
    status: "scheduled",
    method: "POST",
    createdAt: "4 days ago",
    campaignName: "Welcome Series",
    variant: "B",
  },
];

export default function LogsPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const [userAgentFilter, setUserAgentFilter] = useState("all");
  const [apiKeyFilter, setApiKeyFilter] = useState("all");

  const filteredLogs = mockLogs.filter((log) => {
    if (statusFilter !== "all" && log.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Logs</h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="opened">Opened</SelectItem>
            <SelectItem value="clicked">Clicked</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={timeFilter} onValueChange={setTimeFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Last 15 days" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="1">Last 24 hours</SelectItem>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="15">Last 15 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
          </SelectContent>
        </Select>

        <Select value={userAgentFilter} onValueChange={setUserAgentFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All User Agents" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All User Agents</SelectItem>
            <SelectItem value="chrome">Chrome</SelectItem>
            <SelectItem value="firefox">Firefox</SelectItem>
            <SelectItem value="safari">Safari</SelectItem>
          </SelectContent>
        </Select>

        <Select value={apiKeyFilter} onValueChange={setApiKeyFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All API Keys" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All API Keys</SelectItem>
            <SelectItem value="key1">API Key 1</SelectItem>
            <SelectItem value="key2">API Key 2</SelectItem>
            <SelectItem value="key3">API Key 3</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" className="ml-auto">
          <svg
            className="mr-2 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Download
        </Button>
      </div>

      <Card className="rounded-md border-none py-0 shadow-none">
        <CardContent className="rounded-md p-0">
          <div className="overflow-x-auto">
            <table className="w-full rounded-md">
              <thead className="h-1 !rounded-md bg-gray-300">
                <tr className="">
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Campaign Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Variant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Created at
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="mr-3 flex h-4 w-4 items-center justify-center rounded bg-green-100">
                          <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {log.campaignName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
                        Variant {log.variant}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          log.status === "delivered"
                            ? "bg-green-100 text-green-800"
                            : log.status === "scheduled"
                              ? "bg-blue-100 text-blue-800"
                              : log.status === "sent"
                                ? "bg-yellow-100 text-yellow-800"
                                : log.status === "opened"
                                  ? "bg-purple-100 text-purple-800"
                                  : log.status === "clicked"
                                    ? "bg-indigo-100 text-indigo-800"
                                    : log.status === "failed"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {log.status.charAt(0).toUpperCase() +
                          log.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                      {log.createdAt}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Page 1 - 1 of {filteredLogs.length} logs
        </div>
      </div>
    </div>
  );
}
