import * as React from "react";

import { cn } from "@/lib/utils";
import { useMotionTemplate, useMotionValue, motion } from "framer-motion";

export interface InputMultilineProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const InputMultiline = React.forwardRef<
  HTMLTextAreaElement,
  InputMultilineProps
>(({ className, ...props }, ref) => {
  const radius = 100; // change this to increase the rdaius of the hover effect
  const [visible, setVisible] = React.useState(false);

  let mouseX = useMotionValue(0);
  let mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: any) {
    let { left, top } = currentTarget.getBoundingClientRect();

    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }
  return (
    <motion.div
      style={{
        background: useMotionTemplate`
    radial-gradient(
      ${visible ? radius + "px" : "0px"} circle at ${mouseX}px ${mouseY}px,
      var(--yellow-500),
      transparent 180%
    )
  `,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      className="p-[2px] rounded-lg transition duration-300 group/input"
    >
      <textarea
        placeholder="Enter your description"
        className={cn(
          `flex h-40 w-full border border-input dark:bg-black text-black dark:text-white shadow-input rounded-md px-3 py-2 text-sm file:border-0 file:bg-transparent 
    file:text-sm file:font-medium placeholder:text-neutral-400 dark:placeholder-text-neutral-600 
    focus-visible:outline-none focus-visible:ring-[2px] focus-visible:ring-neutral-400 dark:focus-visible:ring-yellow-600
    disabled:cursor-not-allowed disabled:opacity-50
    group-hover/input:shadow-none transition duration-400
    `,
          className
        )}
        ref={ref}
        {...props}
      />
    </motion.div>
  );
});

InputMultiline.displayName = "InputMultiline";

export { InputMultiline };
