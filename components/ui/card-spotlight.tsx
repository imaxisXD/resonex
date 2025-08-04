"use client";

import { useMotionValue, motion, useMotionTemplate } from "motion/react";
import React from "react";

import { cn } from "@/lib/utils";
import { CanvasRevealEffect } from "./canvas-reval-effect";

export const CardSpotlight = ({
  children,
  radius = 350,
  color = "#86efac",
  className,
  ...props
}: {
  radius?: number;
  color?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Automatic animation instead of mouse tracking
  React.useEffect(() => {
    const animateSpotlight = () => {
      const time = Date.now() * 0.001; // Convert to seconds
      const centerX = 200; // Approximate center for a 400px wide card
      const centerY = 200; // Approximate center for a 400px tall card
      const radiusX = 150; // How far the spotlight moves horizontally
      const radiusY = 100; // How far the spotlight moves vertically

      // Create circular motion
      const x = centerX + Math.cos(time * 0.5) * radiusX;
      const y = centerY + Math.sin(time * 0.7) * radiusY; // Different speed for more organic movement

      mouseX.set(x);
      mouseY.set(y);
    };

    const interval = setInterval(animateSpotlight, 16); // ~60fps
    return () => clearInterval(interval);
  }, [mouseX, mouseY]);

  return (
    <div
      className={cn(
        "group/spotlight relative rounded-md border border-green-500 bg-gradient-to-br from-green-50 to-green-100 shadow-sm shadow-green-300 drop-shadow-xl drop-shadow-green-50 duration-150 ease-in-out",
        className,
      )}
      {...props}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px z-0 rounded-md opacity-100 transition duration-300"
        style={{
          backgroundColor: color,
          maskImage: useMotionTemplate`
            radial-gradient(
              ${radius}px circle at ${mouseX}px ${mouseY}px,
              white,
              transparent 80%
            )
          `,
        }}
      >
        <CanvasRevealEffect
          animationSpeed={5}
          containerClassName="bg-transparent absolute inset-0 pointer-events-none"
          colors={[
            [34, 197, 94],
            [22, 163, 74],
          ]}
          dotSize={3}
        />
      </motion.div>
      {children}
    </div>
  );
};
