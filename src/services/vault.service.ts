import sodium from "libsodium-wrappers-sumo";

import type { UnlockedVault } from "@/types/vault";

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
			version: "0.1",
		},
		settings: {
			autoLockTimeout: 5 * 60 * 1000, // 5 minutes
		},
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	};
}
