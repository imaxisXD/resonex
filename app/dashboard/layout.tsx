"use client";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Authenticated } from "convex/react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Authenticated>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="relative flex flex-1 flex-col">
          <Header />
          <div className="absolute top-16 right-0 left-0 z-10 mx-auto h-7 w-[98%] rounded-tl-3xl bg-white/10 opacity-70 backdrop-blur-[2px]" />
          <main className="relative flex-1 overflow-auto rounded-tl-3xl border border-gray-300 bg-white">
            {children}
          </main>
          <div className="absolute right-0 bottom-0 left-0 mx-auto h-12 w-[98%] bg-white/10 opacity-70 backdrop-blur-[2px]" />
        </div>
      </div>
    </Authenticated>
  );
}
