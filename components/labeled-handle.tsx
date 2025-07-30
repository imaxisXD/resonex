import React, { forwardRef, type HTMLAttributes } from "react";
import { type HandleProps } from "@xyflow/react";

import { cn } from "@/lib/utils";
import { BaseHandle } from "@/components/base-handle";

const flexDirections = {
  top: "flex-col",
  right: "flex-row-reverse justify-end",
  bottom: "flex-col-reverse justify-end",
  left: "flex-row",
};

export const LabeledHandle = forwardRef<
  HTMLDivElement,
  HandleProps &
    HTMLAttributes<HTMLDivElement> & {
      title: string;
      handleClassName?: string;
    }
>(({ className, handleClassName, title, position, ...props }, ref) => (
  <div
    ref={ref}
    title={title}
    className={cn(
      "relative flex items-center",
      flexDirections[position],
      className,
    )}
  >
    <BaseHandle
      position={position}
      className={handleClassName}
      {...props}
      style={{
        background: "var(--color-blue-500)",
        height: "10px",
        width: "10px",
        border: "1px solid var(--color-blue-700)",
      }}
    />
  </div>
));

LabeledHandle.displayName = "LabeledHandle";
