/**
 * Copyright 2020 Vercel Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { useEffect } from "react";

import Layout from "./layout";

import Hero from "./hero";
import Form from "./form";
import LearnMore from "./learn-more";
import { useReactiveVar } from "@apollo/client";
import { setLoggedIn, setVisibleHeader } from "@/apollo/reactive-store";
import { Globe } from "./ui/globe";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";

export default function Conf() {
  const loggedIn = useReactiveVar(setLoggedIn);
  const { username, user_id } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (username) {
      router.push(`/${username}/${user_id}`);
    }
    if (!loggedIn) {
      setVisibleHeader(false);
    }
  }, [loggedIn]);

  return (
    <Layout loading={false}>
      {loggedIn ? (
        <Globe />
      ) : (
        <>
          <Hero /> 
          <Form /> 
          {/* <LearnMore /> */}
        </>
      )}
    </Layout>
  );
}
