"use client";
import { api } from "@/convex/_generated/api";
import { Authenticated, useMutation } from "convex/react";
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";

export default function DashboardClient({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Authenticated>
        <StoreUserInDatabase />
        {children}
      </Authenticated>
    </>
  );
}

function StoreUserInDatabase() {
  const { user } = useUser();
  const storeUser = useMutation(api.user.store);
  useEffect(() => {
    void storeUser();
  }, [storeUser, user?.id]);
  return null;
}
