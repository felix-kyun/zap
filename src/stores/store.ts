import { devtools } from "zustand/middleware";
import type { Store } from "@/types/store";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { createUserSlice } from "@stores/userSlice";
import { createVaultSlice } from "./vaultSlice";
import { createAppSlice } from "./appSlice";

export const useStore = create<Store>()(
	devtools(
		immer((...a) => ({
			...createUserSlice(...a),
			...createVaultSlice(...a),
			...createAppSlice(...a),
		})),
	),
);
