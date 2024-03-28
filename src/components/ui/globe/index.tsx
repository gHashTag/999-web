import { useEffect } from "react";
import World from "./world";
import { visibleHeaderVar, visibleSignInVar } from "@/apollo/reactive-store";

export const Globe = () => {
  useEffect(() => {
    visibleHeaderVar(true);
    visibleSignInVar(false);
  }, []);
  return <World />;
};
