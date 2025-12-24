import { Api } from "@services/api.service";
import { Key } from "@services/key.service";
import { Server } from "@services/server.service";
import { Utils } from "@services/utils.service";
import { Vault } from "@services/vault.service";
import type { StateCreator } from "zustand";

import { AppError } from "@/errors/AppError";
import type { Store } from "@/types/store";
import type { LockedVault, Vault as TVault, VaultItem } from "@/types/vault";

type VaultState = {
	key: string | null;
	vault: TVault | null;
};

type VaultActions = {
	setVault: (vault: TVault) => void;
	createInitialVault: (masterPassword: string) => Promise<void>;
	unlockVault: (masterPassword: string) => Promise<void>;
	lockVault: () => Promise<void>;
	saveVault: () => Promise<void>;
	fetchVault: () => Promise<void>;
	checkVaultPassword: (masterPassword: string) => Promise<boolean>;
	addItem: (item: VaultItem) => Promise<void>;
	editItem: (item: VaultItem) => Promise<void>;
	deleteItem: (itemId: string) => Promise<void>;
	updateSettings: (settings: Partial<TVault["settings"]>) => Promise<void>;
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
		const salt = await Key.generateSalt();
		const key = await Key.deriveKey(masterPassword, salt);
		const vault = await Vault.createInitialVault(key, salt);
		set(() => ({ vault, key }), false, "vault/setInitialVault");

		try {
			const lockedVault: LockedVault = {
				...vault,
				state: "locked",
				items: [],
			};
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

	async checkVaultPassword(masterPassword) {
		const { vault } = get();

		if (!vault) throw new Error("No vault to unlock");
		if (vault.state === "unlocked")
			throw new Error("Vault is already unlocked");

		const key = await Key.deriveKey(masterPassword, vault.salt);

		return await Vault.checkVaultKey(key, vault.unlock);
	},

	async unlockVault(masterPassword) {
		const { vault } = get();

		if (!vault) throw new Error("No vault to unlock");
		if (vault.state !== "locked") return;

		const key = await Key.deriveKey(masterPassword, vault.salt);
		const isValid = await Vault.checkVaultKey(key, vault.unlock);

		if (!isValid) {
			throw new AppError("Invalid master password");
		}

		const decryptedItems = await Vault.decryptItems(key, vault.items);

		set(
			(draft) => {
				draft.key = key;
				draft.vault = {
					...vault,
					state: "unlocked",
					items: decryptedItems,
				};
			},
			false,
			"vault/unlockVault",
		);
	},

	async lockVault() {
		const { vault, key } = get();

		if (!vault) throw new Error("No vault to lock");
		if (!key) throw new Error("No key to lock vault");
		if (vault.state !== "unlocked") return;

		const encryptedItems = await Vault.encryptItems(key, vault.items);

		set(
			(draft) => {
				draft.vault = {
					...vault,
					state: "locked",
					items: encryptedItems,
				};
				draft.key = null;
			},
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
			vaultToSave = {
				...vault,
				state: "locked",
				items: await Vault.encryptItems(key, vault.items),
			};
		}

		const response = await Api.fetch("/api/vault", "PUT", vaultToSave);

		if (!response.ok) throw new AppError("Failed to save vault");
	},

	async fetchVault() {
		get().setVault(await Server.fetchVault());
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
			const encryptedItem = await Vault.encryptItem(get().key!, item);

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
						Utils.findAndRemove(
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
			const encryptedItem = await Vault.encryptItem(get().key!, item);

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
