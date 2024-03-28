"use client";
import { useEffect, useState } from "react";
// import { useWeb3Auth } from "@hooks/useWeb3Auth";
import {
  Spacer,
  Image,
  // Button,
  Pagination,
  // Card,
  // CardBody,
} from "@nextui-org/react";
import Layout from "@/components/layout";
import { supabase } from "@/utils/supabase";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

// import { Space } from "@supabase/ui";
const Kanban = dynamic(() => import("@/components/Kanban/KanbanBoard"), {
  ssr: false,
});
export default function Tasks() {
  const router = useRouter();
  useEffect(() => {
    const user_id = localStorage.getItem("user_id");
    if (!user_id) {
      router.push("/");
    }
  }, [router]);

  return (
    <Layout>
      <Kanban />
    </Layout>
  );
}
