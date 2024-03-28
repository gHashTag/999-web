import "@/styles/globals.css";
// import "@/styles/styles.css";
import { useCallback, useEffect, useState } from "react";
import type { AppProps } from "next/app";
import { NextUIProvider } from "@nextui-org/react";
import { HMSRoomProvider } from "@100mslive/react-sdk";
// import { HuddleClient, HuddleProvider } from "@huddle01/react";
import NProgress from "@components/nprogress";
import ResizeHandler from "@components/resize-handler";
import { useWeb3Auth } from "@/hooks/useWeb3Auth";
import BackgroundBeams from "@components/ui/background-beams";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { setLoggedIn } from "@/apollo/reactive-store";
import { ThemeProvider } from "@/components/theme-provider";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  NormalizedCacheObject,
  ReactiveVar,
  createHttpLink,
  defaultDataIdFromObject,
  makeVar,
  useQuery,
} from "@apollo/client";

import {
  authenticateUser,
  initWeb3Auth,
  subscribeToEvents,
} from "@/utils/auth";

import { useRouter } from "next/router";
import { useToast } from "@/components/ui/use-toast";
// import apolloClient from "@/apollo/apollo-client";
import { CachePersistor, LocalStorageWrapper } from "apollo3-cache-persist";
import { setContext } from "@apollo/client/link/context";
import { Spinner } from "@/components/ui/spinner";

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

export type VisibilityFilter = {
  id: string;
  displayName: string;
};

export const VisibilityFilters: { [filter: string]: VisibilityFilter } = {
  SHOW_ALL: {
    id: "show_all",
    displayName: "All",
  },
  SHOW_COMPLETED: {
    id: "show_completed",
    displayName: "Completed",
  },
  SHOW_ACTIVE: {
    id: "show_active",
    displayName: "Active",
  },
};

export interface Todo {
  text: string;
  completed: boolean;
  id: number;
}

export type Todos = Todo[];

const todosInitialValue: Todos = [
  {
    id: 0,
    completed: false,
    text: "Use Apollo Client 3",
  },
];

export const todosVar: ReactiveVar<Todos> = makeVar<Todos>(todosInitialValue);

export const visibilityFilterVar = makeVar<VisibilityFilter>(
  VisibilityFilters.SHOW_ALL
);

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
      const cache = new InMemoryCache({
        dataIdFromObject(responseObject) {
          if ("nodeId" in responseObject) {
            return `${responseObject.nodeId}`;
          }

          return defaultDataIdFromObject(responseObject);
        },
        typePolicies: {
          Query: {
            fields: {
              todos: {
                read() {
                  return todosVar();
                },
              },
              visibilityFilter: {
                read() {
                  return visibilityFilterVar();
                },
              },
              // todosCollection: relayStylePagination(), // example of paginating a collection
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
            ...headers,
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
    return <Spinner />;
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
                <BackgroundBeams />
                <HMSRoomProvider>
                  <Component {...pageProps} />

                  <ResizeHandler />
                  <NProgress />
                  <Toaster />
                </HMSRoomProvider>
                {/* <BackgroundBeamsTwo /> */}
              </ThemeProvider>
            </NextThemesProvider>
          </NextUIProvider>
        </ApolloProvider>
        {/* </HuddleProvider> */}
      </div>
    </main>
  );
}
