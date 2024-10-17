import { useEffect } from "react";
import { TextHoverEffect } from "./ui/text-hover-effect";
import { BentoGridThirdDemo } from "./ui/bento-grid-third";
import Layout from "./layout";
import Hero from "./hero";

export default function LandingPage() {
  return (
    <Layout loading={false}>
       <Hero /> 
      <BentoGridThirdDemo />
    </Layout>
  );
}
