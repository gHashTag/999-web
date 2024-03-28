import { ExtendedOpenloginUserInfo, OptionType, SupabaseUser } from "@/types";
import { makeVar } from "@apollo/client";

export const setUserEmail = makeVar<string>("");

export const visibleSignInVar = makeVar<boolean>(false);

export const visibleHeaderVar = makeVar<boolean>(true);

export const openWeb3ModalVar = makeVar<boolean>(false);

export const openIntroModalVar = makeVar<boolean>(false);

export const setUserId = makeVar<string>("");

export const setLoggedIn = makeVar<boolean>(false);

export const setAddress = makeVar<string>("");

export const setUserInfo = makeVar<ExtendedOpenloginUserInfo | null>(null);

export const setUserSupabase = makeVar<SupabaseUser | null>(null);

export const setInviteCode = makeVar<string>("dao999nft");

export const setInviterUserId = makeVar<string>("");

export const setBalance = makeVar<string | null>(null);

export const setRoomId = makeVar<string | null>(null);

export const setSelectedRoomName = makeVar<string>("");

export const setAssetInfo = makeVar<OptionType | null>(null);
