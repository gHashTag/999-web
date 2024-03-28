import * as React from "react";
import { Spinner as LoadingSpinner } from "@nextui-org/react";

const Spinner = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      height: "100vh",
      alignItems: "center",
      backgroundColor: "#000000",
    }}
  >
    <div style={{ top: 300 }}>
      <LoadingSpinner size="lg" />
    </div>
  </div>
);

export { Spinner };
