import { __DEV__ } from "@/utils/constants";
import { OptionType, SupabaseUser, TSupabaseUser } from "@/types";
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

const initCode = `${__DEV__ ? "reactnativeinitru@gmail.com" : ""}`;

export const setInviteCode = makeVar<string>(initCode);

export const setBalance = makeVar<string | null>(null);

export const setAssetInfo = makeVar<OptionType | null>(null);

export const setActiveRoute = makeVar<string>("/");

export const setLoading = makeVar<boolean>(false);

export const setOpenModalId = makeVar<number | null>(null);

export const setWorkspaceId = makeVar<string>("");

export const setHeaderName = makeVar<string>("");

export const setIdTask = makeVar<string>("");

export const setEditTask = makeVar<boolean>(false);

export const setRoomId = makeVar<string>("");

export const setInviterUserInfo = makeVar<TSupabaseUser>({
  inviter: "",
  select_izbushka: null,
  is_bot: false,
  email: "",
});
