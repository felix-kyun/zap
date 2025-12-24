import { Cacheable } from "@/decorators/cacheable";
import { execute } from "@utils/VaultWorker";
import sodium from "libsodium-wrappers-sumo";

class KeyService {
	private constructor() {}

	static async initialize() {
		await sodium.ready;
		return new KeyService();
	}

	@Cacheable
	async deriveKey(password: string, salt: string) {
		return execute("deriveKey", password, salt);
	}

	generateKeyPair() {
		const keyPair = sodium.crypto_box_keypair();

		return {
			pub: sodium.to_base64(keyPair.publicKey),
			priv: sodium.to_base64(keyPair.privateKey),
		};
	}

	@Cacheable
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

	@Cacheable
	decryptKey(derivedKey: string, encryptedPrivateKey: string, nonce: string) {
		const decrypted = sodium.crypto_secretbox_open_easy(
			sodium.from_base64(encryptedPrivateKey),
			sodium.from_base64(nonce),
			sodium.from_base64(derivedKey),
		);
	}

	createSalt() {
		return sodium.to_base64(
			sodium.randombytes_buf(sodium.crypto_pwhash_SALTBYTES),
		);
	}
}

export const Key = await KeyService.initialize();
