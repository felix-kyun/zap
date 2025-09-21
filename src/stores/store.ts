import { devtools } from "zustand/middleware";
import type { Store } from "../types/store";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { createUserSlice } from "./userSlice";

export const useStore = create<Store>()(
    devtools(
        immer((...a) => ({
            ...createUserSlice(...a),
        })),
    ),
);
