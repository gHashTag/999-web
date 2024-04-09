import { useEffect } from "react";
import { useRouter } from "next/router";
import { retrieveLaunchParams } from "@tma.js/sdk";

const BabaYaga = () => {
  const { initData } = retrieveLaunchParams();

  return <div>{JSON.stringify(initData)}</div>;
};

export default BabaYaga;
