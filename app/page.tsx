import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  MailIcon,
  BarChart3Icon,
  CalendarIcon,
  ZapIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  UsersIcon,
  TrendingUpIcon,
} from "lucide-react";
import Image from "next/image";

export const metadata = {
  title: "Resonex",
  description:
    "AI-powered newsletter automation platform for creators and marketers.",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 z-30 border-b bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-1">
              <Image
                src="/resonex-logo.webp"
                alt="Resonex"
                width={32}
                height={32}
              />
              <Image
                src="/resonex-txt.webp"
                alt="Resonex"
                width={100}
                height={100}
              />
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/sign-in" className={cn(buttonVariants(), "text-sm")}>
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              AI-Powered Newsletter
              <span className="from-convex-yellow to-highlight-txt block bg-gradient-to-r bg-clip-text text-transparent">
                Automation Platform
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
              Generate engaging newsletters from prompts, A/B test subject
              lines, and optimize send times with AI-driven insights. Built for
              creators, marketers, and businesses who want to scale their email
              marketing.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link
                href="/sign-in"
                className={cn(buttonVariants({ size: "lg" }), "text-base")}
              >
                Let&apos;s Create Campaign
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to create winning newsletters
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              From AI content generation to performance optimization, we&apos;ve
              got you covered.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <ZapIcon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                AI Content Generation
              </h3>
              <p className="text-gray-600">
                Generate engaging newsletter content from simple prompts. Our AI
                creates compelling headlines, body content, and calls-to-action
                tailored to your audience.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <BarChart3Icon className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                A/B Testing
              </h3>
              <p className="text-gray-600">
                Automatically test two subject line variants and track
                performance. Get data-driven insights to optimize your email
                campaigns.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                <CalendarIcon className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Smart Scheduling
              </h3>
              <p className="text-gray-600">
                Get AI-powered recommendations for optimal send times based on
                your audience&apos;s engagement patterns and historical
                performance data.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
                <TrendingUpIcon className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Real-Time Analytics
              </h3>
              <p className="text-gray-600">
                Track opens, clicks, bounces, and conversions in real-time.
                Monitor campaign performance with detailed insights and reports.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
                <MailIcon className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Campaign Management
              </h3>
              <p className="text-gray-600">
                Create, edit, and schedule campaigns with ease. Manage your
                email lists, templates, and automation workflows all in one
                place.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100">
                <UsersIcon className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Recipient Management
              </h3>
              <p className="text-gray-600">
                Import and manage your subscriber lists with CSV uploads.
                Segment your audience and personalize your campaigns for better
                engagement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              How it works
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              Get from idea to sent newsletter in minutes, not hours.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-600">
                1
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Write a Prompt
              </h3>
              <p className="text-gray-600">
                Describe your newsletter content in natural language.
                &quot;Weekly fintech digest&quot; or &quot;Monthly product
                updates&quot; - our AI understands your intent.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-2xl font-bold text-green-600">
                2
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Review & Customize
              </h3>
              <p className="text-gray-600">
                Review AI-generated content, edit subject lines, and customize
                the design. Upload your recipient list and set your schedule.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 text-2xl font-bold text-purple-600">
                3
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Launch & Optimize
              </h3>
              <p className="text-gray-600">
                Send your A/B tested campaign and watch real-time performance.
                Get insights to optimize future campaigns and improve
                engagement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Save time, increase engagement
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Stop spending hours crafting newsletters. Our AI platform helps
                you create compelling content in minutes while improving your
                email performance.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start">
                  <CheckCircleIcon className="mt-1 mr-3 h-5 w-5 text-green-500" />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      10x faster content creation
                    </h4>
                    <p className="text-sm text-gray-600">
                      Generate newsletters in minutes instead of hours
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircleIcon className="mt-1 mr-3 h-5 w-5 text-green-500" />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      25% higher open rates
                    </h4>
                    <p className="text-sm text-gray-600">
                      A/B testing and smart scheduling boost engagement
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircleIcon className="mt-1 mr-3 h-5 w-5 text-green-500" />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Real-time performance tracking
                    </h4>
                    <p className="text-sm text-gray-600">
                      Monitor opens, clicks, and conversions as they happen
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 p-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between rounded-lg bg-white p-4 shadow-sm">
                  <div className="flex items-center">
                    <div className="mr-4 h-10 w-10 rounded-full bg-blue-100"></div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Average Open Rate
                      </p>
                      <p className="text-sm text-gray-600">Last 30 days</p>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">32.4%</p>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-white p-4 shadow-sm">
                  <div className="flex items-center">
                    <div className="mr-4 h-10 w-10 rounded-full bg-green-100"></div>
                    <div>
                      <p className="font-medium text-gray-900">
                        A/B Test Winner
                      </p>
                      <p className="text-sm text-gray-600">Subject line B</p>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-green-600">+18%</p>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-white p-4 shadow-sm">
                  <div className="flex items-center">
                    <div className="mr-4 h-10 w-10 rounded-full bg-purple-100"></div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Optimal Send Time
                      </p>
                      <p className="text-sm text-gray-600">AI recommended</p>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-purple-600">10:00 AM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gradient-to-br from-gray-900 to-slate-900 py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center">
              <Image
                src="/resonex-logo.webp"
                alt="Resonex"
                className="h-8 w-auto"
                width={32}
                height={32}
              />

              <span className="ml-2 text-xl font-bold text-white">Resonex</span>
            </div>
            <p className="mt-4 text-center text-sm text-gray-400">
              AI-powered newsletter automation platform for creators and
              marketers.
            </p>
          </div>
          <div className="mt-8 w-full border-t border-gray-800 pt-8">
            <p className="text-center text-sm text-gray-400">
              © 2025 Resonex. All rights reserved. Built for the Convex ❤️ +
              Resend Hackathon.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
