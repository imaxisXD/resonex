"use client";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";

export default function DashboardClient({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Authentication required</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <StoreUserInDatabase />
      {children}
    </>
  );
}

function StoreUserInDatabase() {
  const { user } = useUser();
  const storeUser = useMutation(api.user.store);

  useEffect(() => {
    if (user?.id) {
      void storeUser();
    }
  }, [storeUser, user?.id]);

  return null;
}
