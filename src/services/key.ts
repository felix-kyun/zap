import sodium from "libsodium-wrappers-sumo";

import { Cacheable } from "@/decorators/cacheable";

import { Executor } from "@services/executor";

/*
 * TODO:
 * - generate sub keys from master key for specific purpose
 */

class KeyService {
	private constructor() {}

	static async initialize() {
		await sodium.ready;
		return new KeyService();
	}

	generateSalt() {
		return Executor.execute("generateSalt");
	}

	generateKeyPair() {
		return Executor.execute("generateKeyPair");
	}

	@Cacheable
	async deriveKey(password: string, salt: string) {
		return Executor.execute("deriveKey", password, salt);
	}

	@Cacheable
	encryptKey(derivedKey: string, privateKey: string) {
		return Executor.execute("encryptKey", derivedKey, privateKey);
	}

	@Cacheable
	decryptKey(derivedKey: string, encryptedPrivateKey: string, nonce: string) {
		return Executor.execute(
			"decryptKey",
			derivedKey,
			encryptedPrivateKey,
			nonce,
		);
	}
}

export const Key = await KeyService.initialize();
