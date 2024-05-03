import { useQuery, useReactiveVar } from "@apollo/client";
import { useUser } from "./useUser";

import {
  GET_ROOM_ASSET,
  GET_ROOMS_ASSETS_COLLECTION,
} from "@/graphql/query.rooms";
import { setRoomId } from "@/apollo/reactive-store";

const useAssets = () => {
  const { recording_id } = useUser();

  const roomId = useReactiveVar(setRoomId);

  const {
    data: assetsData,
    loading: assetsLoading,
    error: assetsError,
    refetch: assetsRefetch,
  } = useQuery(GET_ROOMS_ASSETS_COLLECTION, {
    variables: {
      room_id: roomId,
    },
  });

  const {
    loading: assetLoading,
    error: assetError,
    data: assetData,
  } = useQuery(GET_ROOM_ASSET, {
    variables: { recording_id },
  });

  return {
    assetData,
    assetLoading,
    assetError,
    asset: assetsData?.room_assetsCollection?.edges[0]?.node,
    assetItems: assetsData?.room_assetsCollection?.edges,
    assetsData,
    assetsLoading,
    assetsError,
    assetsRefetch,
  };
};

export { useAssets };
