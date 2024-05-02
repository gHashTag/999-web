import { useEffect } from "react";
import { useRouter } from "next/router";

const Meets = () => {
  const router = useRouter();
  console.log(router.query, "router.query");
  const workspace_id = router.query.workspace_id;

  const roomCode = router.query.slug;

  useEffect(() => {
    const setRoute = async () => {
      try {
        if (router.query.slug) {
          router.push(
            {
              pathname: `/[workspace_id]/[room_id]/meet/[roomCode]`,
              query: {
                workspace_id,
                roomCode,
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
