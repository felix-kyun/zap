import { createUserSlice } from "@stores/userSlice";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import type { Store } from "@/types/store";

import { createAppSlice } from "./appSlice";
import { createVaultSlice } from "./vaultSlice";

export const useStore = create<Store>()(
	devtools(
		immer((...a) => ({
			...createUserSlice(...a),
			...createVaultSlice(...a),
			...createAppSlice(...a),
		})),
	),
);
