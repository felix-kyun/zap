import type { StateCreator } from "zustand";

import type { Store } from "@/types/store";

type AppState = {
	creationModalState: boolean;
	query: string;
};

type AppActions = {
	setCreationModal: (creationModalState: boolean) => void;
	setQuery: (query: string) => void;
};

const initialAppState: AppState = {
	creationModalState: false,
	query: "",
};

export type AppSlice = AppState & AppActions;

export const createAppSlice: StateCreator<
	Store,
	[["zustand/devtools", never], ["zustand/immer", never]],
	[],
	AppSlice
> = (set) => ({
	...initialAppState,
	// actions
	setCreationModal: (creationModalState) =>
		set(() => ({ creationModalState }), false, "app/setCreationModal"),
	setQuery: (query) => set(() => ({ query }), false, "search/setQuery"),
});
