import { AppError } from "@/errors/AppError";
import { fetchVault as fetchRemoteVault } from "@services/server.service";
import type { Store } from "@/types/store";
import type { Vault, VaultItem } from "@/types/vault";
import { post } from "@utils/post";
import { execute, parallelExecuter } from "@utils/VaultWorker";
import type { StateCreator } from "zustand";

type VaultState = {
	key: string | null;
	vault: Vault | null;
};

type VaultActions = {
	setVault: (vault: Vault) => void;
	setInitialVault: (vault: Vault, masterPassword: string) => Promise<void>;
	setKeyFromPassword: (masterPassword: string) => Promise<void>;
	unlockVault: (masterPassword: string) => Promise<void>;
	saveVault: () => Promise<void>;
	fetchVault: () => Promise<void>;
	checkVaultPassword: (masterPassword: string) => Promise<boolean>;
	addItem: (item: VaultItem) => void;
	clearVault: () => void;
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

	setVault(vault) {
		set(() => ({ vault }), false, "vault/setVault");
	},

	async setInitialVault(vault, masterPassword) {
		const key = await execute("deriveKey", masterPassword, vault.salt);
		set(() => ({ vault, key }), false, "vault/setInitialVault");
	},

	async setKeyFromPassword(masterPassword) {
		const { vault } = get();

		if (!vault) throw new Error("No vault to set key for");
		if (vault.state !== "locked") return;

		const key = await execute("deriveKey", masterPassword, vault.salt);
		const isValid = await execute("checkVaultKey", key, vault);

		if (!isValid) {
			throw new AppError("Invalid master password");
		}

		set(() => ({ key }), false, "vault/setKey");
	},

	async unlockVault(masterPassword) {
		const { vault } = get();

		if (!vault) throw new Error("No vault to unlock");
		if (vault.state !== "locked") return;

		const [exec, terminate] = parallelExecuter();

		const key = await exec("deriveKey", masterPassword, vault.salt);
		const isValid = await exec("checkVaultKey", key, vault);

		if (!isValid) {
			terminate();
			throw new AppError("Invalid master password");
		}

		const decryptedItems = await Promise.all(
			vault.items.map((item) => exec("decryptItem", item, key)),
		);

		terminate();

		set(
			() => ({
				key,
				vault: {
					state: "unlocked",
					items: decryptedItems,
					salt: vault.salt,
					meta: vault.meta,
					settings: vault.settings,
				},
			}),
			false,
			"vault/unlockVault",
		);
	},

	async saveVault() {
		const { vault, key } = get();

		if (!vault) throw new Error("No vault to save");
		if (!key) throw new Error("No key to save vault");

		let vaultToSave = vault;

		if (vault.state === "unlocked") {
			vaultToSave = await execute("lockVault", key, vault);
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

		const key = await execute("deriveKey", masterPassword, vault.salt);

		return await execute("checkVaultKey", key, vault);
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
	clearVault() {
		set(() => ({ vault: null, key: null }), false, "vault/clearVault");
	},
});
