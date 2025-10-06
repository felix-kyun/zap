import type {
	Vault,
	LockedVault,
	UnlockedVault,
	VaultItem,
	VaultUnlockData,
} from "@/types/vault";
import sodium from "libsodium-wrappers-sumo";
import { vaultItemSchema } from "../schemas/vault";

// export methods which can be called from worker thread
export default {
	deriveKey,
	checkVaultKey,
	unlockVault,
	lockVault,
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
	const encodedMessage = sodium.crypto_aead_xchacha20poly1305_ietf_decrypt(
		null,
		sodium.from_base64(unlock.ciphertext),
		null,
		sodium.from_base64(unlock.nonce),
		sodium.from_base64(key),
	);

	const message = sodium.to_string(encodedMessage);

	if (message === "unlock") return true;

	return false;
}

export function unlockVault(key: string, vault: LockedVault): UnlockedVault {
	const { salt, items, meta, settings } = vault;

	// verify key by decrypting unlock data
	if (!checkVaultKey(key, vault)) throw new Error("Invalid key");

	// decrypt items
	const decryptedItems: VaultItem[] = [];
	for (const item of items) {
		const decryptedMessage =
			sodium.crypto_aead_xchacha20poly1305_ietf_decrypt(
				null,
				sodium.from_base64(item.ciphertext),
				null,
				sodium.from_base64(item.nonce),
				sodium.from_base64(key),
			);
		const unknownItem = JSON.parse(sodium.to_string(decryptedMessage));
		try {
			const decryptedItem = vaultItemSchema.parse(unknownItem);
			decryptedItems.push(decryptedItem);
		} catch {
			throw new Error("Failed to parse decrypted item");
		}
	}

	return {
		state: "unlocked",
		salt,
		meta,
		settings,
		items: decryptedItems,
	};
}

export function lockVault(
	key: string,
	{ salt, items, meta, settings }: Vault,
): Vault {
	// encrypt items
	const encryptedItems = items.map((item) => {
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
	});

	return {
		state: "locked",
		salt,
		meta,
		settings,
		items: encryptedItems,
		unlock: createUnlockData(key),
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
