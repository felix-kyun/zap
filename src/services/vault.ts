import sodium from "libsodium-wrappers-sumo";

import type {
	EncryptedVaultItem,
	UnlockedVault,
	VaultItem,
	VaultUnlockData,
} from "@/types/vault";

import { Cacheable } from "@decorators/cacheable";
import { Executor } from "@services/executor";

class VaultService {
	private constructor() {}

	static async initialize() {
		await sodium.ready;
		return new VaultService();
	}

	@Cacheable
	async generateUnlockCiphertext(key: string) {
		return Executor.execute("generateUnlockCiphertext", key);
	}

	@Cacheable
	async checkVaultKey(key: string, unlockData: VaultUnlockData) {
		return Executor.execute("checkVaultKey", key, unlockData);
	}

	@Cacheable
	async encryptItem(key: string, item: VaultItem) {
		return Executor.execute("encryptItem", item, key);
	}

	@Cacheable
	private async encryptItemWithExecutor(
		executor: ReturnType<typeof Executor.createExecutor>["exec"],
		key: string,
		item: VaultItem,
	) {
		return executor("encryptItem", item, key);
	}

	async encryptItems(key: string, items: VaultItem[]) {
		const pexec = Executor.createExecutor();

		const encryptedItems = await Promise.all(
			items.map((item) =>
				this.encryptItemWithExecutor(pexec.exec, key, item),
			),
		);

		pexec.terminate();
		return encryptedItems;
	}

	@Cacheable
	async decryptItem(key: string, item: EncryptedVaultItem) {
		return Executor.execute("decryptItem", item, key);
	}

	@Cacheable
	private async decryptItemWithExecutor(
		executor: ReturnType<typeof Executor.createExecutor>["exec"],
		key: string,
		item: EncryptedVaultItem,
	) {
		return executor("decryptItem", item, key);
	}

	async decryptItems(key: string, items: EncryptedVaultItem[]) {
		const pexec = Executor.createExecutor();

		const decryptedItems = await Promise.all(
			items.map((item) =>
				Vault.decryptItemWithExecutor(pexec.exec, key, item),
			),
		);

		pexec.terminate();
		return decryptedItems;
	}

	async createInitialVault(
		key: string,
		salt: string,
	): Promise<UnlockedVault> {
		const unlock = await this.generateUnlockCiphertext(key);
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
			unlock,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};
	}
}

export const Vault = await VaultService.initialize();
