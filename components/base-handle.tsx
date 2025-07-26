import { forwardRef } from "react";
import { Handle, type HandleProps } from "@xyflow/react";

import { cn } from "@/lib/utils";

export type BaseHandleProps = HandleProps;

export const BaseHandle = forwardRef<HTMLDivElement, BaseHandleProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Handle
        ref={ref}
        {...props}
        className={cn(
          "!-top-2.5 h-[11px] w-[11px] rounded-full border border-slate-300 bg-slate-100 transition",
          className,
        )}
        {...props}
      >
        {children}
      </Handle>
    );
  },
);

BaseHandle.displayName = "BaseHandle";
