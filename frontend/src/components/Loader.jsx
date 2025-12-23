"use client";

import { Loader2 } from "lucide-react";
import clsx from "clsx";

const sizeMap = {
  xs: "h-3 w-3",
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-10 w-10",
};

export default function Loader({
  size = "md",
  text,
  fullscreen = false,
  className,
}) {
  const spinner = (
    <div className={clsx("flex items-center gap-2", className)}>
      <Loader2
        className={clsx(
          "animate-spin text-muted-foreground",
          sizeMap[size]
        )}
      />
      {text && (
        <span className="text-sm text-muted-foreground">{text}</span>
      )}
    </div>
  );

  if (!fullscreen) return spinner;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm">
      {spinner}
    </div>
  );
}
