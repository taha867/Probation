import * as React from "react";
import { cn } from "@/lib/utils";

// Simple horizontal separator styled like shadcn/ui
const Separator = React.forwardRef(({ className, orientation = "horizontal", ...props }, ref) => {
  return (
    <div
      ref={ref}
      aria-orientation={orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "vertical" ? "w-px h-full" : "h-px w-full",
        className,
      )}
      {...props}
    />
  );
});
Separator.displayName = "Separator";

export { Separator };

