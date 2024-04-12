import { useEffect } from "react";
import { useRouter } from "next/router";

const Meets = () => {
  const router = useRouter();

  useEffect(() => {
    const setRoute = async () => {
      try {
        if (router.query.slug) {
          router.push(
            {
              pathname: `/[workspace_id]/meet/[roomId]`,
              query: {
                workspace_id: router.query.workspace_id,
                roomId: router.query.slug,
              },
            },
            `/${router.query.workspace_id}/meet/${router.query.slug}`
          );
        }
      } catch (error) {
        console.error("Error", error);
      }
    };

    setRoute();
  }, [router]);
};

export default Meets;
