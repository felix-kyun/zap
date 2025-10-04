import type { UserSlice } from "@stores/userSlice";
import type { VaultSlice } from "@stores/vaultSlice";

export type Store = UserSlice & VaultSlice;
