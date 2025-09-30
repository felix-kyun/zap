import type { StateCreator } from "zustand";
import type { Store } from "@/types/store";

type UserState = {
	id: string;
	username: string;
	email: string;
	loggedIn: boolean;
};

type UserActions = {
	setUser: (user: Partial<UserState>) => void;
	clearUser: () => void;
};

const initialUserState: UserState = {
	id: "",
	username: "",
	email: "",
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
	setUser: (user) => set(() => ({ ...user })),
	clearUser: () => set(() => ({ ...initialUserState })),
	setAuthenticated: (isAuthenticated: boolean) =>
		set(() => ({ isAuthenticated })),
});
