import { useEffect } from "react";
import { useRouter } from "next/router";
// import { useWeb3Auth } from "@/hooks/useWeb3Auth";

const Meets = () => {
  const router = useRouter();

  useEffect(() => {
    const setRoute = async () => {
      try {
        if (router.query.slug) {
          router.push(
            {
              pathname: `/[workspaceSlug]/create-meet/meets/[roomId]`,
              query: {
                workspaceSlug: router.query.workspaceSlug,
                roomId: router.query.slug,
              },
            },
            `/${router.query.workspaceSlug}/create-meet/meets/${router.query.slug}`
          );
        }
      } catch (error) {
        console.error("Error", error);
      }
    };

    setRoute();
  }, []);
};

export default Meets;
