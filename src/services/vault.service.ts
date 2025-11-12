import sodium from "libsodium-wrappers-sumo";

import type { UnlockedVault, VaultItem } from "@/types/vault";

await sodium.ready;

export function createInitialVault(): UnlockedVault {
	const salt = sodium.to_base64(
		sodium.randombytes_buf(sodium.crypto_pwhash_SALTBYTES),
	);

	return {
		state: "unlocked",
		salt,
		items: [],
		meta: {
			version: "1.0",
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		},
		settings: {
			autoLockTimeout: 300000, // 5 minutes
		},
	};
}

export function createItemBase(
	name: string,
): Pick<VaultItem, "id" | "createdAt" | "updatedAt" | "name"> {
	return {
		id: crypto.randomUUID(),
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		name,
	};
}

export function createLoginItem({
	name,
	url,
	username,
	password,
}: VaultItem & { type: "login" }) {
	return {
		type: "login",
		...createItemBase(name),
		url,
		username,
		password,
	};
}
