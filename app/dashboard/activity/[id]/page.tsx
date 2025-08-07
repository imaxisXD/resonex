"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";

const mockCampaignData = {
  subjectLines: {
    A: "🚀 Weekly Fintech Digest - Market Insights Inside",
    B: "Your Weekly Fintech Update is Here",
  },
  winner: "A", // Based on open rate performance
};

const mockABPerformance = [
  {
    date: "Feb 01",
    variantA_delivered: 1200,
    variantA_opened: 734,
    variantA_clicked: 245,
    variantA_bounced: 8,
    variantB_delivered: 1200,
    variantB_opened: 612,
    variantB_clicked: 198,
    variantB_bounced: 12,
  },
  {
    date: "Feb 02",
    variantA_delivered: 1400,
    variantA_opened: 896,
    variantA_clicked: 312,
    variantA_bounced: 15,
    variantB_delivered: 1400,
    variantB_opened: 742,
    variantB_clicked: 251,
    variantB_bounced: 18,
  },
  {
    date: "Feb 03",
    variantA_delivered: 975,
    variantA_opened: 623,
    variantA_clicked: 187,
    variantA_bounced: 6,
    variantB_delivered: 975,
    variantB_opened: 507,
    variantB_clicked: 152,
    variantB_bounced: 9,
  },
];

// Historical performance over time
const mockHistoricalData = [
  { date: "Jan 29", delivered: 2380, opened: 1456, clicked: 487, bounced: 20 },
  { date: "Jan 30", delivered: 1785, opened: 1024, clicked: 312, bounced: 15 },
  { date: "Jan 31", delivered: 3170, opened: 1895, clicked: 623, bounced: 30 },
  { date: "Feb 01", delivered: 2400, opened: 1346, clicked: 443, bounced: 20 },
  { date: "Feb 02", delivered: 2800, opened: 1638, clicked: 563, bounced: 33 },
  { date: "Feb 03", delivered: 1950, opened: 1130, clicked: 339, bounced: 15 },
];

export default function CampaignActivityPage() {
  const params = useParams();
  const campaignId = params.id as string;
  const campaign = useQuery(api.campaigns.getCampaign, { campaignId });
  const emailStatuses = useQuery(api.abEmails.getEmailStatus, {
    campaignId,
  });

  console.log(emailStatuses);

  // Calculate A/B testing metrics
  const totalA_delivered = mockABPerformance.reduce(
    (sum, day) => sum + day.variantA_delivered,
    0,
  );
  const totalA_opened = mockABPerformance.reduce(
    (sum, day) => sum + day.variantA_opened,
    0,
  );
  const totalA_clicked = mockABPerformance.reduce(
    (sum, day) => sum + day.variantA_clicked,
    0,
  );
  const totalA_bounced = mockABPerformance.reduce(
    (sum, day) => sum + day.variantA_bounced,
    0,
  );

  const totalB_delivered = mockABPerformance.reduce(
    (sum, day) => sum + day.variantB_delivered,
    0,
  );
  const totalB_opened = mockABPerformance.reduce(
    (sum, day) => sum + day.variantB_opened,
    0,
  );
  const totalB_clicked = mockABPerformance.reduce(
    (sum, day) => sum + day.variantB_clicked,
    0,
  );
  const totalB_bounced = mockABPerformance.reduce(
    (sum, day) => sum + day.variantB_bounced,
    0,
  );

  const openRateA = ((totalA_opened / totalA_delivered) * 100).toFixed(1);
  const openRateB = ((totalB_opened / totalB_delivered) * 100).toFixed(1);
  const clickRateA = ((totalA_clicked / totalA_opened) * 100).toFixed(1);
  const clickRateB = ((totalB_clicked / totalB_opened) * 100).toFixed(1);
  const bounceRateA = ((totalA_bounced / totalA_delivered) * 100).toFixed(1);
  const bounceRateB = ((totalB_bounced / totalB_delivered) * 100).toFixed(1);

  // Overall totals
  const totalDelivered = mockHistoricalData.reduce(
    (sum, day) => sum + day.delivered,
    0,
  );
  const totalOpened = mockHistoricalData.reduce(
    (sum, day) => sum + day.opened,
    0,
  );
  const totalClicked = mockHistoricalData.reduce(
    (sum, day) => sum + day.clicked,
    0,
  );
  const totalBounced = mockHistoricalData.reduce(
    (sum, day) => sum + day.bounced,
    0,
  );

  return (
    <div className="mx-auto min-h-screen max-w-5xl rounded-tl-3xl p-4 py-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="mb-10 flex flex-col gap-1 space-y-1">
          <h1 className="flex items-center gap-2 text-2xl leading-tight font-bold">
            Campaign:
            {campaign ? (
              <span className="text-highlight-txt">
                {campaign.campaignName}
              </span>
            ) : (
              <Skeleton as="span" className="h-6 w-32" />
            )}{" "}
            - Analytics
          </h1>
        </div>

        <Card className="rounded-lg border-x border-x-emerald-400 bg-gradient-to-tr from-white to-emerald-50/60 py-5">
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="mb-1 font-semibold text-emerald-900">
                  Winning Subject Line
                </h3>
                <p className="text-sm font-medium text-emerald-800">
                  Variant {mockCampaignData.winner}: &ldquo;
                  {
                    mockCampaignData.subjectLines[
                      mockCampaignData.winner as keyof typeof mockCampaignData.subjectLines
                    ]
                  }
                  &rdquo;
                </p>
                <p className="mt-1 text-xs text-emerald-600">
                  {mockCampaignData.winner === "A" ? openRateA : openRateB}%
                  open rate vs{" "}
                  {mockCampaignData.winner === "A" ? openRateB : openRateA}% for
                  variant {mockCampaignData.winner === "A" ? "B" : "A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Card className="border-l-2 border-l-pink-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-slate-800">
                Variant A:
              </CardTitle>
              <p className="text-xs text-slate-600">
                Subject Line: &ldquo;{mockCampaignData.subjectLines.A}&rdquo;
              </p>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-slate-600">Delivered</p>
                  <p className="font-bold text-slate-900">
                    {totalA_delivered.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-slate-600">Opens</p>
                  <p className="font-bold text-slate-900">
                    {totalA_opened.toLocaleString()}
                  </p>
                  <p className="text-blue-600">{openRateA}%</p>
                </div>
                <div>
                  <p className="text-slate-600">Clicks</p>
                  <p className="font-bold text-slate-900">
                    {totalA_clicked.toLocaleString()}
                  </p>
                  <p className="text-blue-600">{clickRateA}%</p>
                </div>
                <div>
                  <p className="text-slate-600">Bounces</p>
                  <p className="font-bold text-slate-900">{totalA_bounced}</p>
                  <p className="text-red-600">{bounceRateA}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-2 border-l-purple-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-slate-800">
                Variant B:
              </CardTitle>
              <p className="text-xs text-slate-600">
                Subject Line: &ldquo;{mockCampaignData.subjectLines.B}&rdquo;
              </p>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-slate-600">Delivered</p>
                  <p className="font-bold text-slate-900">
                    {totalB_delivered.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-slate-600">Opens</p>
                  <p className="font-bold text-slate-900">
                    {totalB_opened.toLocaleString()}
                  </p>
                  <p className="text-purple-600">{openRateB}%</p>
                </div>
                <div>
                  <p className="text-slate-600">Clicks</p>
                  <p className="font-bold text-slate-900">
                    {totalB_clicked.toLocaleString()}
                  </p>
                  <p className="text-purple-600">{clickRateB}%</p>
                </div>
                <div>
                  <p className="text-slate-600">Bounces</p>
                  <p className="font-bold text-slate-900">{totalB_bounced}</p>
                  <p className="text-red-600">{bounceRateB}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* A/B Comparison Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-800">
              A/B Performance Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={mockABPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: "#475569" }}
                  axisLine={{ stroke: "#cbd5e1" }}
                  tickLine={{ stroke: "#cbd5e1" }}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#475569" }}
                  axisLine={{ stroke: "#cbd5e1" }}
                  tickLine={{ stroke: "#cbd5e1" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #cbd5e1",
                    borderRadius: "6px",
                    fontSize: "12px",
                    color: "#1e293b",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="variantA_opened"
                  stackId="1"
                  stroke="var(--color-pink-500)"
                  fill="#3b82f640"
                  name="Variant A Opens"
                />
                <Area
                  type="monotone"
                  dataKey="variantB_opened"
                  stackId="2"
                  stroke="var(--color-purple-500)"
                  fill="#8b5cf640"
                  name="Variant B Opens"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Overall Campaign Metrics */}
        <div className="grid grid-cols-4 gap-2">
          <Card className="border-l-2 border-l-emerald-200">
            <CardContent>
              <p className="text-xs font-medium tracking-wide text-slate-600 uppercase">
                Total Delivered
              </p>
              <p className="text-base font-bold text-slate-900">
                {totalDelivered.toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-2 border-l-sky-200">
            <CardContent>
              <p className="text-xs font-medium tracking-wide text-slate-600 uppercase">
                Total Opens
              </p>
              <p className="text-base font-bold text-slate-900">
                {totalOpened.toLocaleString()}
              </p>
              <p className="text-xs text-slate-500">
                {((totalOpened / totalDelivered) * 100).toFixed(1)}%
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-2 border-l-slate-400">
            <CardContent>
              <p className="text-xs font-medium tracking-wide text-slate-600 uppercase">
                Total Clicks
              </p>
              <p className="text-base font-bold text-slate-900">
                {totalClicked.toLocaleString()}
              </p>
              <p className="text-xs text-slate-500">
                {((totalClicked / totalOpened) * 100).toFixed(1)}%
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-2 border-l-red-200">
            <CardContent>
              <p className="text-xs font-medium tracking-wide text-slate-600 uppercase">
                Total Bounces
              </p>
              <p className="text-base font-bold text-slate-900">
                {totalBounced.toLocaleString()}
              </p>
              <p className="text-xs text-red-600">
                {((totalBounced / totalDelivered) * 100).toFixed(1)}%
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Historical Performance */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-800">
              Historical Campaign Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={mockHistoricalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: "#475569" }}
                  axisLine={{ stroke: "#cbd5e1" }}
                  tickLine={{ stroke: "#cbd5e1" }}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#475569" }}
                  axisLine={{ stroke: "#cbd5e1" }}
                  tickLine={{ stroke: "#cbd5e1" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #cbd5e1",
                    borderRadius: "6px",
                    fontSize: "12px",
                    color: "#1e293b",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="delivered"
                  stackId="1"
                  stroke="var(--color-emerald-500)"
                  fill="#e2e8f040"
                  name="Delivered"
                />
                <Area
                  type="monotone"
                  dataKey="opened"
                  stackId="2"
                  stroke="var(--color-sky-500)"
                  fill="#64748b30"
                  name="Opened"
                />
                <Area
                  type="monotone"
                  dataKey="clicked"
                  stackId="3"
                  stroke="var(--color-slate-500)"
                  fill="#37415120"
                  name="Clicked"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
