import React from "react";
import { cn } from "@/lib/utils";

interface NodeAppendixProps {
  children: React.ReactNode;
  position: "top" | "bottom" | "left" | "right";
  className?: string;
}

const positionClasses = {
  top: "absolute bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "absolute top-full left-1/2 -translate-x-1/2 mt-2",
  left: "absolute right-full top-1/2 -translate-y-1/2 mr-2",
  right: "absolute left-full top-1/2 -translate-y-1/2 ml-2",
};

export function NodeAppendix({
  children,
  position,
  className,
}: NodeAppendixProps) {
  return (
    <div
      className={cn(
        "bg-card text-card-foreground z-10 min-w-0 rounded-md border p-3 shadow-lg",
        positionClasses[position],
        className,
      )}
    >
      {children}
    </div>
  );
}
