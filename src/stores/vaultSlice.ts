import { execute, parallelExecuter } from "@utils/VaultWorker";
import type { StateCreator } from "zustand";

import { AppError } from "@/errors/AppError";
import type { Store } from "@/types/store";
import type { Vault, VaultItem } from "@/types/vault";
import { findAndRemove } from "@utils/findAndRemove";
import { createInitialVault as createInitialVaultService } from "@services/vault.service";
import { Api } from "@services/api.service";
import { Server } from "@services/server.service";

type VaultState = {
	key: string | null;
	vault: Vault | null;
};

type VaultActions = {
	setVault: (vault: Vault) => void;
	createInitialVault: (masterPassword: string) => Promise<void>;
	setKeyFromPassword: (masterPassword: string) => Promise<void>;
	unlockVault: (masterPassword: string) => Promise<void>;
	lockVault: () => Promise<void>;
	saveVault: () => Promise<void>;
	fetchVault: () => Promise<void>;
	checkVaultPassword: (masterPassword: string) => Promise<boolean>;
	addItem: (item: VaultItem) => Promise<void>;
	editItem: (item: VaultItem) => Promise<void>;
	deleteItem: (itemId: string) => Promise<void>;
	updateSettings: (settings: Partial<Vault["settings"]>) => Promise<void>;
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

	async createInitialVault(masterPassword) {
		const vault = createInitialVaultService();
		const key = await execute("deriveKey", masterPassword, vault.salt);
		set(() => ({ vault, key }), false, "vault/setInitialVault");

		try {
			const lockedVault = await execute("lockVault", key, vault);
			const response = await Api.fetch("/api/vault", "POST", lockedVault);
			if (!response.ok)
				throw new Error("Failed to create vault on server");
		} catch (error) {
			set(
				() => ({ vault: null, key: null }),
				false,
				"vault/createInitialVault/rollback",
			);
			throw error;
		}
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
					createdAt: vault.createdAt,
					updatedAt: vault.updatedAt,
				},
			}),
			false,
			"vault/unlockVault",
		);
	},

	async lockVault() {
		const { vault, key } = get();

		if (!vault) throw new Error("No vault to lock");
		if (!key) throw new Error("No key to lock vault");
		if (vault.state !== "unlocked") return;

		const lockedVault = await execute("lockVault", key, vault);

		set(
			() => ({
				vault: lockedVault,
				key: null,
			}),
			false,
			"vault/lockVault",
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

		const response = await Api.fetch("/api/vault", "PUT", vaultToSave);

		if (!response.ok) throw new AppError("Failed to save vault");
	},

	async fetchVault() {
		get().setVault(await Server.fetchVault());
	},

	async checkVaultPassword(masterPassword) {
		const { vault } = get();

		if (!vault) throw new Error("No vault to unlock");

		if (vault.state === "unlocked")
			throw new Error("Vault is already unlocked");

		const key = await execute("deriveKey", masterPassword, vault.salt);

		return await execute("checkVaultKey", key, vault);
	},
	async addItem(item) {
		const vault = get().vault;

		// validations
		if (!item || !item.id) throw new Error("Invalid item");
		if (!vault) throw new Error("No vault to add item to");
		if (vault.state !== "unlocked" || get().key === null)
			throw new Error("Vault is not unlocked");

		set(
			(draft) => {
				if (draft.vault && draft.vault.state === "unlocked")
					draft.vault.items.push(item);
			},
			false,
			"vault/addItem",
		);

		try {
			const encryptedItem = await execute(
				"encryptItem",
				item,
				get().key!,
			);

			const response = await Api.fetch(
				"/api/vault/items",
				"POST",
				encryptedItem,
			);

			if (!response.ok) throw new Error("Failed to add item to server");
		} catch (error) {
			set(
				(draft) => {
					if (draft.vault && draft.vault.state === "unlocked")
						findAndRemove(
							draft.vault.items,
							(i) => i.id === item.id,
						);
				},
				false,
				"vault/addItem/rollback",
			);
			throw error;
		}
	},
	async editItem(item) {
		const vault = get().vault;

		// validations
		if (!item || !item.id) throw new Error("Invalid item");
		if (!vault) throw new Error("No vault to edit item in");
		if (vault.state !== "unlocked" || get().key === null)
			throw new Error("Vault is not unlocked");

		const index = vault.items.findIndex((i) => i.id === item.id);
		if (index === -1) throw new Error("Item not found in vault");

		const oldItem = vault.items[index];
		set(
			(draft) => {
				if (draft.vault && draft.vault.state === "unlocked")
					draft.vault.items[index] = item;
			},
			false,
			"vault/editItem",
		);

		try {
			const encryptedItem = await execute(
				"encryptItem",
				item,
				get().key!,
			);

			const response = await Api.fetch(
				`/api/vault/items/${item.id}`,
				"PUT",
				encryptedItem,
			);

			if (!response.ok) throw new Error("Failed to add item to server");
		} catch (error) {
			set(
				(draft) => {
					if (draft.vault && draft.vault.state === "unlocked")
						draft.vault.items[index] = oldItem;
				},
				false,
				"vault/editItem/rollback",
			);
			throw error;
		}
	},
	async deleteItem(itemId) {
		const vault = get().vault;

		if (!itemId) throw new Error("Invalid item ID");
		if (!vault) throw new Error("No vault to delete item from");
		if (vault.state !== "unlocked")
			throw new Error("Vault is not unlocked");

		const index = vault.items.findIndex((i) => i.id === itemId);
		if (index === -1) throw new Error("Item not found in vault");
		const item = vault.items[index];

		set(
			(draft) => {
				if (draft.vault && draft.vault.state === "unlocked")
					draft.vault.items.splice(index, 1);
			},
			false,
			"vault/deleteItem",
		);

		try {
			const response = await Api.fetch(
				`/api/vault/items/${itemId}`,
				"DELETE",
			);
			if (!response.ok)
				throw new Error("Failed to delete item from server");
		} catch (error) {
			set(
				(draft) => {
					if (draft.vault && draft.vault.state === "unlocked")
						draft.vault.items[index] = item;
				},
				false,
				"vault/deleteItem/rollback",
			);
			throw error;
		}
	},
	async updateSettings(settings) {
		const vault = get().vault;
		if (!vault) throw new Error("No vault to update settings for");

		const currentSettings = vault.settings;
		set(
			(draft) => {
				if (draft.vault)
					draft.vault.settings = {
						...draft.vault.settings,
						...settings,
					};
			},
			false,
			"vault/updateSettings",
		);

		try {
			const response = await Api.fetch("/api/vault", "PATCH", {
				settings: {
					...currentSettings,
					...settings,
				},
			});
			if (!response.ok)
				throw new Error("Failed to update vault settings on server");
		} catch (error) {
			set(
				(draft) => {
					if (draft.vault) draft.vault.settings = currentSettings;
				},
				false,
				"vault/updateSettings/rollback",
			);
			throw error;
		}
	},
	clearVault() {
		set(() => ({ vault: null, key: null }), false, "vault/clearVault");
	},
});
