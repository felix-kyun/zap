import sodium from "libsodium-wrappers-sumo";

import type { UnlockedVault } from "@/types/vault";
import { Key } from "./key.service";

class VaultService {
	private constructor() {}

	static async initialize() {
		await sodium.ready;
		return new VaultService();
	}

	createInitialVault(): UnlockedVault {
		const salt = Key.createSalt();

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
}

export const Vault = await VaultService.initialize();
