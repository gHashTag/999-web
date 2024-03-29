import * as React from "react";
import { Spinner as LoadingSpinner } from "@nextui-org/react";

const Spinner = ({ size }: { size: "sm" | "md" | "lg" }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      height: "100%",
      width: "100%",
      alignItems: "center",
      alignSelf: "center",
    }}
  >
    <div>
      <LoadingSpinner size={size} style={{ bottom: 50 }} />
    </div>
  </div>
);

export { Spinner };
