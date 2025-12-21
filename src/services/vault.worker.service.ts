import sodium from "libsodium-wrappers-sumo";

import type {
	EncryptedVaultItem,
	LockedVault,
	Vault,
	VaultItem,
	VaultUnlockData,
} from "@/types/vault";

import { vaultItemSchema } from "../schemas/vault";

// export methods which can be called from worker thread
export default {
	deriveKey,
	checkVaultKey,
	lockVault,
	decryptItem,
	encryptItem,
};

export function deriveKey(masterPassword: string, salt: string) {
	const encodedPassword = sodium.from_string(masterPassword);
	const encodedSalt = sodium.from_base64(salt);

	const key = sodium.crypto_pwhash(
		32,
		encodedPassword,
		encodedSalt,
		sodium.crypto_pwhash_OPSLIMIT_MODERATE,
		sodium.crypto_pwhash_MEMLIMIT_MODERATE,
		sodium.crypto_pwhash_ALG_ARGON2ID13,
	);

	return sodium.to_base64(key);
}

export function checkVaultKey(key: string, { unlock }: LockedVault): boolean {
	try {
		const encodedMessage =
			sodium.crypto_aead_xchacha20poly1305_ietf_decrypt(
				null,
				sodium.from_base64(unlock.ciphertext),
				null,
				sodium.from_base64(unlock.nonce),
				sodium.from_base64(key),
			);
		const message = sodium.to_string(encodedMessage);

		if (message === "unlock") return true;
	} catch {
		return false;
	}

	return false;
}

async function decryptItem(
	item: EncryptedVaultItem,
	key: string,
): Promise<VaultItem> {
	const decryptedMessage = sodium.crypto_aead_xchacha20poly1305_ietf_decrypt(
		null,
		sodium.from_base64(item.ciphertext),
		null,
		sodium.from_base64(item.nonce),
		sodium.from_base64(key),
	);

	const unknownItem = JSON.parse(sodium.to_string(decryptedMessage));
	try {
		return vaultItemSchema.parse(unknownItem);
	} catch {
		throw new Error("Failed to parse decrypted item");
	}
}

async function encryptItem(
	item: VaultItem,
	key: string,
): Promise<EncryptedVaultItem> {
	const nonce = sodium.randombytes_buf(
		sodium.crypto_aead_xchacha20poly1305_ietf_NPUBBYTES,
	);
	const message = sodium.from_string(JSON.stringify(item));
	const ciphertext = sodium.crypto_aead_xchacha20poly1305_ietf_encrypt(
		message,
		null,
		null,
		nonce,
		sodium.from_base64(key),
	);

	return {
		id: item.id,
		nonce: sodium.to_base64(nonce),
		ciphertext: sodium.to_base64(ciphertext),
	};
}

export async function lockVault(
	key: string,
	{ state, salt, items, meta, settings, createdAt, updatedAt }: Vault,
): Promise<Vault> {
	if (state !== "unlocked") {
		throw new Error("Vault is already locked");
	}
	// encrypt items
	const encryptedItems = await Promise.all(
		items.map((item) => encryptItem(item, key)),
	);

	return {
		state: "locked",
		salt,
		meta,
		settings,
		items: encryptedItems,
		unlock: createUnlockData(key),
		createdAt,
		updatedAt,
	};
}

// helpers
function createUnlockData(key: string): VaultUnlockData {
	const nonce = sodium.randombytes_buf(
		sodium.crypto_aead_xchacha20poly1305_ietf_NPUBBYTES,
	);
	const message = sodium.from_string("unlock");
	const ciphertext = sodium.crypto_aead_xchacha20poly1305_ietf_encrypt(
		message,
		null,
		null,
		nonce,
		sodium.from_base64(key),
	);

	return {
		nonce: sodium.to_base64(nonce),
		ciphertext: sodium.to_base64(ciphertext),
		target: "unlock",
	};
}
