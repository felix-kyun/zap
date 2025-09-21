import type { StateCreator } from "zustand";
import type { Store } from "../types/store";

type UserState = {
    username: string;
    name: string;
    email: string;
    token: string;
};

type UserActions = {
    setUser: (user: UserState) => void;
    clearUser: () => void;
};

const initialUserState: UserState = {
    username: "",
    name: "",
    email: "",
    token: "",
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
});
