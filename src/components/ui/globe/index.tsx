import { useEffect } from "react";
import World from "./world";
import { visibleHeaderVar, visibleSignInVar } from "@/apollo/reactive-store";

export const Globe = () => {
  useEffect(() => {
    visibleHeaderVar(true);
    visibleSignInVar(false);
  }, []);
  return (
    <>
      <div style={{ paddingTop: 50 }}>
        <h2
          className="text-center text-4xl md:text-4xl font-bold text-black dark:text-white"
          style={{ width: "400px", margin: "0 auto" }}
        >
          Welcome to the Far Far Away Kingdom!!!
        </h2>
        <p className="text-center text-base md:text-lg font-normal text-neutral-700 dark:text-neutral-200 max-w-md mt-2 mx-auto">
          <span className="text-yellow-500">
            {" "}
            Lets make this world bright and exciting together
          </span>
        </p>
      </div>
      <World />
    </>
  );
};
