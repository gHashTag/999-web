import { __DEV__ } from "@/pages/_app";
import { OptionType, SupabaseUser } from "@/types";
import { makeVar } from "@apollo/client";

export const setUserEmail = makeVar<string>("");

export const visibleSignInVar = makeVar<boolean>(false);

export const setVisibleHeader = makeVar<boolean>(true);

export const openWeb3ModalVar = makeVar<boolean>(false);

export const openIntroModalVar = makeVar<boolean>(false);

export const setUserId = makeVar<string>("");

export const setLoggedIn = makeVar<boolean>(false);

export const setAddress = makeVar<string>("");

export const setUserInfo = makeVar<SupabaseUser | null>(null);

export const setUserSupabase = makeVar<SupabaseUser | null>(null);

const initCode = `${__DEV__ ? "dao999nft" : ""}`;

export const setInviteCode = makeVar<string>(initCode);

export const setBalance = makeVar<string | null>(null);

export const setAssetInfo = makeVar<OptionType | null>(null);

export const setActiveRoute = makeVar<string>("/");

export const setLoading = makeVar<boolean>(false);

export const setOpenModalId = makeVar<number | null>(null);

export const setHeaderName = makeVar<string | null>("");

export const setRoomName = makeVar<string | null>("");

export const setIdTask = makeVar<number | null>(null);
