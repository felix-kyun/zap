import type { Store } from "@/types/store";
import type { Vault } from "@/types/vault";
import { checkVaultKey, deriveKey, unlockVault } from "@services/vault.service";
import type { StateCreator } from "zustand";

type VaultState = {
    key: string | null;
    vault: Vault | null;
};

type VaultActions = {
    setKey: (key: string) => void;
    setVault: (vault: Vault) => void;
    unlockVault: (masterPassword: string) => void;
    checkVaultPassword: (masterPassword: string) => boolean;
};

const initialVaultState: VaultState = {
    key: null,
    vault: null,
};

export type VaultSlice = VaultState & VaultActions;

export const createVaultSlice: StateCreator<
    Store,
    [["zustand/devtools", never], ["zustand/immer", never]],
    [],
    VaultSlice
> = (set, get) => ({
    ...initialVaultState,
    // actions
    setKey: (key) => set(() => ({ key })),
    setVault: (vault) => set(() => ({ vault })),
    checkVaultPassword: (masterPassword) => {
        const { vault } = get();

        if (!vault) throw new Error("No vault to unlock");
        if (!vault || vault.state !== "locked") return false;

        const key = deriveKey(masterPassword, vault.salt);
        return checkVaultKey(key, vault);
    },
    unlockVault: (masterPassword) => {
        const { vault } = get();

        if (!vault) throw new Error("No vault to unlock");
        if (vault.state !== "locked") return;

        const key = deriveKey(masterPassword, vault.salt);
        set(() => ({ vault: unlockVault(key, vault), key }));
    },
});
