import { createAppSlice } from "@stores/appSlice";
import { createUserSlice } from "@stores/userSlice";
import { createVaultSlice } from "@stores/vaultSlice";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import type { Store } from "@/types/store";

export const useStore = create<Store>()(
	devtools(
		immer((...a) => ({
			...createUserSlice(...a),
			...createVaultSlice(...a),
			...createAppSlice(...a),
		})),
	),
);
