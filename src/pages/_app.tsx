import "@/styles/globals.css";
// import "@/styles/styles.css";
import { useCallback, useEffect, useState } from "react";
import type { AppProps } from "next/app";
import { NextUIProvider } from "@nextui-org/react";
import { HMSRoomProvider } from "@100mslive/react-sdk";
// import { HuddleClient, HuddleProvider } from "@huddle01/react";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import NProgress from "@components/nprogress";
import ResizeHandler from "@components/resize-handler";
import BackgroundBeams from "@components/ui/background-beams";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { setLoggedIn } from "@/apollo/reactive-store";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  NormalizedCacheObject,
  createHttpLink,
  defaultDataIdFromObject,
} from "@apollo/client";

import {
  authenticateUser,
  initWeb3Auth,
  subscribeToEvents,
} from "@/utils/auth";

import { useRouter } from "next/router";
import { useToast } from "@/components/ui/use-toast";
import { CachePersistor, LocalStorageWrapper } from "apollo3-cache-persist";
import { setContext } from "@apollo/client/link/context";
import { Spinner } from "@/components/ui/spinner";
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";
import { corsHeaders } from "@/helpers/corsHeaders";

export var __DEV__ = process.env.NODE_ENV !== "production";

if (!process.env.NEXT_PUBLIC_SITE_URL) {
  throw new Error("NEXT_PUBLIC_SITE_URL is not set");
}

export const SITE_URL = __DEV__
  ? "http://localhost:3000/"
  : process.env.NEXT_PUBLIC_SITE_URL;

if (__DEV__) {
  // Adds messages only in a dev environment
  loadDevMessages();
  loadErrorMessages();
}

// const huddleClient = new HuddleClient({
//   projectId: process.env.NEXT_PUBLIC_PROJECT_ID || "",
//   options: {
//     activeSpeakers: {
//       size: 8,
//     },
//   },
// });

// Authorization: token
//         ? `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
//         : "",

export const cache = new InMemoryCache({
  dataIdFromObject(responseObject) {
    if ("nodeId" in responseObject) {
      return `${responseObject.nodeId}`;
    }

    return defaultDataIdFromObject(responseObject);
  },
  typePolicies: {
    Query: {
      fields: {
        node: {
          read(_, { args, toReference }) {
            const ref = toReference({
              nodeId: args?.nodeId,
            });

            return ref;
          },
        },
      },
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    initWeb3Auth(router, toast);
    const unsubscribe = subscribeToEvents(async () => {
      await authenticateUser();
      setLoggedIn(true);
    });
    return unsubscribe;
  }, []);

  const [client, setClient] = useState<ApolloClient<NormalizedCacheObject>>();
  // const [persistor, setPersistor] =
  //   useState<CachePersistor<NormalizedCacheObject>>();

  useEffect(() => {
    async function init() {
      // let newPersistor = new CachePersistor({
      //   cache,
      //   storage: new LocalStorageWrapper(window.localStorage),
      //   debug: true,
      //   trigger: "write",
      // });
      // await newPersistor.restore();
      // setPersistor(newPersistor);
      const httpLink = createHttpLink({
        uri: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/graphql/v1`,
      });

      const authLink = setContext(async (_, { headers }) => {
        //const token = (await supabase.auth.getSession()).data.session?.access_token;

        return {
          headers: {
            ...corsHeaders,
            apiKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          },
        };
      });

      setClient(
        new ApolloClient({
          link: authLink.concat(httpLink),
          cache,
          connectToDevTools: true,
        })
      );
    }

    init().catch(console.error);
  }, []);

  // const clearCache = useCallback(() => {
  //   if (!persistor) {
  //     return;
  //   }
  //   persistor.purge();
  // }, [persistor]);

  const reload = useCallback(() => {
    window.location.reload();
  }, []);

  if (!client) {
    return <Spinner size="lg" />;
  }

  return (
    <main className="dark text-foreground bg-background">
      <div>
        {/* <HuddleProvider client={huddleClient}> */}
        <ApolloProvider client={client}>
          <NextUIProvider>
            <NextThemesProvider attribute="class" defaultTheme="dark">
              <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem
                disableTransitionOnChange
              >
                <TonConnectUIProvider
                  manifestUrl="https://dmrooqbmxdhdyblqzswu.supabase.co/storage/v1/object/public/docs/tonconnect-manifest.json"
                  actionsConfiguration={{
                    twaReturnUrl: "https://t.me/dao999nft_dev_bot/start",
                  }}
                >
                  <Analytics />
                  <SpeedInsights />
                  {/* <BackgroundBeams /> */}
                  <HMSRoomProvider>
                    <Component {...pageProps} />

                    <ResizeHandler />
                    <NProgress />
                    <Toaster />
                  </HMSRoomProvider>
                  {/* <BackgroundBeamsTwo /> */}
                </TonConnectUIProvider>
              </ThemeProvider>
            </NextThemesProvider>
          </NextUIProvider>
        </ApolloProvider>
        {/* </HuddleProvider> */}
      </div>
    </main>
  );
}
