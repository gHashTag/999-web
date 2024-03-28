import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputMultilineProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const InputMultiline = React.forwardRef<
  HTMLTextAreaElement,
  InputMultilineProps
>(({ className, ...props }, ref) => {
  return (
    <textarea
      placeholder="Enter your description"
      className={cn(
        "flex h-40 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
      )}
      ref={ref}
      {...props}
    />
  );
});

InputMultiline.displayName = "InputMultiline";

export { InputMultiline };
