import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "font-semibold rounded-lg relative transition-transform active:translate-y-0.5 active:shadow-none focus:outline-none focus:ring-2 focus:ring-offset-2 bg-[#A13B8C] text-white border bg-clip-padding border-b-2 border-[#6C1D57] hover:bg-[#8D2676] shadow-[0_3px_0_#6C1D57] focus:ring-[#C94FC6] text-sm",
        destructive:
          "font-semibold rounded-lg relative transition-transform active:translate-y-0.5 active:shadow-none focus:outline-none focus:ring-2 focus:ring-offset-2 bg-red-600 text-white border bg-clip-padding border-b-2 border-red-700 hover:bg-red-500 shadow-[0_3px_0_#dc2626] focus:ring-red-400 text-sm",
        outline:
          "font-semibold rounded-lg relative transition-transform active:translate-y-0.5 active:shadow-none focus:outline-none focus:ring-2 focus:ring-offset-2 bg-white text-gray-900 border border-gray-300 bg-clip-padding border-b-2 border-gray-400 hover:bg-gray-50 shadow-[0_3px_0_#9ca3af] focus:ring-blue-400 text-sm",
        secondary:
          "font-semibold rounded-lg relative transition-transform active:translate-y-0.5 active:shadow-none focus:outline-none focus:ring-2 focus:ring-offset-2 bg-gray-100 text-gray-900 border bg-clip-padding border-b-2 border-gray-300 hover:bg-gray-200 shadow-[0_3px_0_#d1d5db] focus:ring-gray-400 text-sm",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "px-4 py-2 has-[>svg]:px-3",
        sm: "gap-1.5 px-3 py-1.5 has-[>svg]:px-2.5 text-xs",
        lg: "px-6 py-3 has-[>svg]:px-4 text-base",
        icon: "px-2 py-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
