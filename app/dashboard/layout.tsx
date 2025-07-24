import Sidebar from "@/components/Sidebar";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="bg-gray-100 px-8 py-3 relative z-10 ">
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
        <main className="flex-1 bg-white rounded-tl-3xl p-8 relative overflow-auto border border-gray-300">
          {children}
        </main>
      </div>
    </div>
  );
}
