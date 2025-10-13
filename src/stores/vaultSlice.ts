import { AppError } from "@/errors/AppError";
import { fetchVault as fetchRemoteVault } from "@services/server.service";
import type { Store } from "@/types/store";
import type { Vault, VaultItem } from "@/types/vault";
import { post } from "@utils/post";
import { createVaultWorker } from "@utils/VaultWorker";
import type { StateCreator } from "zustand";

type VaultState = {
	key: string | null;
	vault: Vault | null;
};

type VaultActions = {
	setKeyFromPassword: (masterPassword: string) => Promise<void>;
	setVault: (vault: Vault) => void;
	unlockVault: () => Promise<void>;
	saveVault: () => Promise<void>;
	fetchVault: () => Promise<void>;
	checkVaultPassword: (masterPassword: string) => Promise<boolean>;
	addItem: (item: VaultItem) => void;
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
	async setKeyFromPassword(masterPassword) {
		const { vault } = get();

		if (!vault) throw new Error("No vault to unlock");

		const key = await createVaultWorker(
			"deriveKey",
			masterPassword,
			vault.salt,
		);

		set(() => ({ key }), false, "vault/setKeyFromPassword");
	},

	setVault(vault) {
		set(() => ({ vault }), false, "vault/setVault");
	},

	async unlockVault() {
		const { vault, key } = get();

		if (!vault) throw new Error("No vault to unlock");
		if (!key) throw new Error("No key to unlock vault");
		if (vault.state !== "locked") return;

		const unlockedVault = await createVaultWorker(
			"unlockVault",
			key,
			vault,
		);

		set(() => ({ vault: unlockedVault, key }), false, "vault/unlockVault");
	},

	async saveVault() {
		const { vault, key } = get();

		if (!vault) throw new Error("No vault to save");
		if (!key) throw new Error("No key to save vault");

		let vaultToSave = vault;

		if (vault.state === "unlocked") {
			vaultToSave = await createVaultWorker("lockVault", key, vault);
		}

		const response = await post("/api/vault/sync", {
			vault: JSON.stringify(vaultToSave),
		});

		if (!response.ok) throw new AppError("Failed to save vault");
	},

	async fetchVault() {
		get().setVault(await fetchRemoteVault());
	},

	async checkVaultPassword(masterPassword) {
		const { vault } = get();

		if (!vault) throw new Error("No vault to unlock");

		if (vault.state === "unlocked")
			throw new Error("Vault is already unlocked");

		const key = await createVaultWorker(
			"deriveKey",
			masterPassword,
			vault.salt,
		);

		return await createVaultWorker("checkVaultKey", key, vault);
	},
	addItem(item) {
		set(
			(draft) => {
				if (!draft.vault) throw new Error("No vault to add item to");
				if (draft.vault.state !== "unlocked")
					throw new Error("Vault is not unlocked");
				draft.vault.items.push(item);
			},
			false,
			"vault/addItem",
		);
	},
});
