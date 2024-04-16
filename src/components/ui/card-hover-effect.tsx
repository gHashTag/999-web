import { useUser } from "@/hooks/useUser";
import { RecordingAsset } from "@/types";
import { cn } from "@/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

type HoverEffectProps = {
  items: {
    node: RecordingAsset;
  }[];
  className?: string;
};

export const HoverEffect = ({ items, className }: HoverEffectProps) => {
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const { user_id, workspace_id } = useUser();

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-3  lg:grid-cols-6  py-10 w-full",
        className
      )}
    >
      {items &&
        items.map((item, idx) => (
          <Link
            href={`/${user_id}/${workspace_id}/${item.node.room_id}/${item.node.recording_id}`}
            key={item.node.recording_id}
            className="relative group  block p-2 h-full w-full"
            onMouseEnter={() => {
              setHoveredIndex(idx);
              localStorage.setItem("recording_id", item.node.recording_id);
            }}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <AnimatePresence>
              {hoveredIndex === idx && (
                <motion.span
                  className="absolute inset-0 h-full w-full bg-neutral-200 dark:bg-yellow-600/[0.8] block rounded-3xl"
                  layoutId="hoverBackground"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    transition: { duration: 0.15 },
                  }}
                  exit={{
                    opacity: 0,
                    transition: { duration: 0.15, delay: 0.2 },
                  }}
                />
              )}
            </AnimatePresence>
            <Card>
              <CardTitle>{item.node.title}</CardTitle>
              <CardDescription>{item.node.summary_short}</CardDescription>
            </Card>
          </Link>
        ))}
    </div>
  );
};

export const Card = ({
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "rounded-2xl h-42 w-45 p-4 overflow-hidden  border border-transparent dark:border-yellow-500/[0.2] group-hover:border-black relative z-20"
      )}
      style={{
        backgroundColor: "var(--main-background)",
      }}
    >
      <div className="relative z-50">
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};
export const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h4
      className={cn("text-zinc-100 font-bold tracking-wide mt-0", className)}
      style={{
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
    >
      {children}
    </h4>
  );
};
export const CardDescription = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <p
      className={cn(
        "mt-3 text-zinc-400 tracking-wide leading-relaxed text-sm h-full",
        className
      )}
      style={{
        display: "-webkit-box",
        WebkitLineClamp: 4,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
    >
      {children}
    </p>
  );
};
