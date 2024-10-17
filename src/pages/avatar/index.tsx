import { useEffect } from "react";
import { TextHoverEffect } from "../../components/ui/text-hover-effect";
import { BentoGridThirdDemo } from "../../components/ui/bento-grid-third";
import Layout from "@/components/layout";
import Hero from "@/components/hero";
import { ImagesSliderDemo } from "@/components/ui/images-slider-demo";
import { ParallaxScrollDemo } from "@/components/ui/parallax-scroll-demo";
import { VortexDemo } from "@/components/ui/vortex-demo";

import { StickyScrollRevealDemo } from "@/components/ui/sticky-scroll-reveal-demo";
import { SparklesPreview } from "@/components/ui/sparkles-preview";
import { InfiniteMovingCardsDemo } from "@/components/ui/infinite-moving-cards-demo";
import { CardStackDemo } from "@/components/ui/card-stack-demo";
import { BackgroundBoxesDemo } from "@/components/ui/background-boxes-demo";

export default function LandingPage() {
  return (
    <div>
      <SparklesPreview isHidden={false} />
     
      <ParallaxScrollDemo />
      <StickyScrollRevealDemo />
      <CardStackDemo />
      <SparklesPreview isHidden={true} />
    </div>
  );
}
