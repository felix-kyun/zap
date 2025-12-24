import sodium from "libsodium-wrappers-sumo";

import type {
	EncryptedVaultItem,
	LockedVault,
	Vault,
	VaultItem,
	VaultUnlockData,
} from "@/types/vault";

import { vaultItemSchema } from "../schemas/vault";

class VaultWorkerService {
	private constructor() {}

	static initialize() {
		return new VaultWorkerService();
	}

	ready() {
		return sodium.ready;
	}

	generateSalt() {
		return sodium.to_base64(
			sodium.randombytes_buf(sodium.crypto_pwhash_SALTBYTES),
		);
	}

	generateKeyPair() {
		const keyPair = sodium.crypto_box_keypair();

		return {
			pub: sodium.to_base64(keyPair.publicKey),
			priv: sodium.to_base64(keyPair.privateKey),
		};
	}

	encryptKey(derivedKey: string, privateKey: string) {
		const nonce = sodium.randombytes_buf(
			sodium.crypto_secretbox_NONCEBYTES,
		);

		const ciphertext = sodium.crypto_secretbox_easy(
			sodium.from_base64(privateKey),
			nonce,
			sodium.from_base64(derivedKey),
		);

		return {
			nonce: sodium.to_base64(nonce),
			priv_enc: sodium.to_base64(ciphertext),
		};
	}

	decryptKey(derivedKey: string, encryptedPrivateKey: string, nonce: string) {
		const decrypted = sodium.crypto_secretbox_open_easy(
			sodium.from_base64(encryptedPrivateKey),
			sodium.from_base64(nonce),
			sodium.from_base64(derivedKey),
		);

		return sodium.to_base64(decrypted);
	}

	deriveKey(masterPassword: string, salt: string) {
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

	checkVaultKey(key: string, { unlock }: LockedVault): boolean {
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

	decryptItem(item: EncryptedVaultItem, key: string): VaultItem {
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
			return vaultItemSchema.parse(unknownItem);
		} catch {
			throw new Error("Failed to parse decrypted item");
		}
	}

	encryptItem(item: VaultItem, key: string): EncryptedVaultItem {
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

	async lockVault(
		key: string,
		{ state, salt, items, meta, settings, createdAt, updatedAt }: Vault,
	): Promise<Vault> {
		if (state !== "unlocked") {
			throw new Error("Vault is already locked");
		}
		// encrypt items
		const encryptedItems = await Promise.all(
			items.map((item) => this.encryptItem(item, key)),
		);

		return {
			state: "locked",
			salt,
			meta,
			settings,
			items: encryptedItems,
			unlock: this.createUnlockData(key),
			createdAt,
			updatedAt,
		};
	}

	// helpers
	createUnlockData(key: string): VaultUnlockData {
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
}

export const VaultWorker = VaultWorkerService.initialize();
