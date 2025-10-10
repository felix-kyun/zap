type VaultType = "login" | "note" | "card" | "identity" | "custom";

export interface VaultItemBase {
	id: string;
	type: VaultType;
	name: string;
	createdAt: string;
	updatedAt: string;
	tags: {
		value: string;
	}[];
}

export interface LoginItem extends VaultItemBase {
	type: "login";
	url: string;
	username: string;
	password: string;
}

export interface NoteItem extends VaultItemBase {
	type: "note";
	content: string;
}

export interface CardItem extends VaultItemBase {
	type: "card";
	cardHolder: string;
	cardNumber: string;
	cardExpiry: string;
	cardCVV?: string;
}

export interface IdentityItem extends VaultItemBase {
	type: "identity";
	fullName: string;
	dateOfBirth?: string;
	address?: string;
	phoneNumber?: string;
	email?: string;
}

export interface CustomItem extends VaultItemBase {
	type: "custom";
	fields: Record<string, string>;
}

export type VaultItem =
	| LoginItem
	| NoteItem
	| CardItem
	| IdentityItem
	| CustomItem;

export interface EncryptedVaultItem {
	id: string;
	nonce: string;
	ciphertext: string;
}

export interface VaultMeta {
	version: string;
	createdAt: string;
	updatedAt: string;
}

export interface VaultSettings {
	autoLockTimeout: number;
}

export interface VaultUnlockData {
	nonce: string;
	ciphertext: string;
	target: string;
}

interface BaseVault {
	state: "locked" | "unlocked";
	salt: string;
	meta: VaultMeta;
	settings: VaultSettings;
}

export interface UnlockedVault extends BaseVault {
	state: "unlocked";
	items: VaultItem[];
}

export interface LockedVault extends BaseVault {
	state: "locked";
	items: EncryptedVaultItem[];
	unlock: VaultUnlockData;
}

export type Vault = UnlockedVault | LockedVault;
