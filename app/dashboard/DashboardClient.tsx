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
