"use client";
import { useScroll, useTransform, motion } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export const ParallaxScroll = ({
  images,
  className,
}: {
  images: string[];
  className?: string;
}) => {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    container: gridRef,
    offset: ["start start", "end start"],
  });

  const translateFirst = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const translateSecond = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const translateThird = useTransform(scrollYProgress, [0, 1], [0, -200]);

  const third = Math.ceil(images.length / 3);

  const firstPart = images.slice(0, third);
  const secondPart = images.slice(third, 2 * third);
  const thirdPart = images.slice(2 * third);

  const ImageGrid = ({ images, translate, gridKey }: { images: string[], translate: any, gridKey: string }) => (
    <div className="grid gap-10">
      {images.map((el, idx) => (
        <motion.div style={{ y: translate }} key={`${gridKey}-${idx}`}>
          <Image
            src={el}
            className="h-80 w-full object-cover object-left-top rounded-lg gap-10 !m-0 !p-0"
            height="400"
            width="400"
            alt="thumbnail"
          />
        </motion.div>
      ))}
    </div>
  );

  return (
    <div
      className={cn("h-[50rem] items-start overflow-y-auto w-full", className)}
      ref={gridRef}
    >
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-start max-w-5xl mx-auto gap-10 py-20 px-10"
      >
        <ImageGrid images={firstPart} translate={translateFirst} gridKey="grid-1" />
        <ImageGrid images={secondPart} translate={translateSecond} gridKey="grid-2" />
        <ImageGrid images={thirdPart} translate={translateThird} gridKey="grid-3" />
      </div>
    </div>
  );
};
