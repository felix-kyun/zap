import type { StateCreator } from "zustand";

import type { UserInfo } from "@/schemas/user";
import type { Store } from "@/types/store";

type UserState =
	| {
			user: UserInfo;
			loggedIn: true;
	  }
	| {
			user: null;
			loggedIn: false;
	  };

type UserActions = {
	setUser: (user: UserInfo) => void;
	clearUser: () => void;
};

const initialUserState: UserState = {
	user: null,
	loggedIn: false,
};

export type UserSlice = UserState & UserActions;
export const createUserSlice: StateCreator<
	Store,
	[["zustand/devtools", never], ["zustand/immer", never]],
	[],
	UserSlice
> = (set) => ({
	...initialUserState,
	// actions
	setUser: (user) =>
		set(
			() => ({ user: { ...user }, loggedIn: true }),
			false,
			"user/setUser",
		),
	clearUser: () =>
		set(() => ({ user: null, loggedIn: null }), false, "user/clearUser"),
});
