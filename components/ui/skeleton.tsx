import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  as?: "div" | "span";
}

function Skeleton({ className, as = "div", ...props }: SkeletonProps) {
  const baseClasses = cn(
    "animate-pulse rounded-sm bg-gray-200 duration-150 ease-in-out",
    className,
  );

  if (as === "span") {
    return (
      <span
        data-slot="skeleton"
        className={cn(baseClasses, "inline-block")}
        {...props}
      />
    );
  }

  return <div data-slot="skeleton" className={baseClasses} {...props} />;
}

export { Skeleton };
