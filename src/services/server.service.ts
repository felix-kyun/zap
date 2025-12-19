import { post } from "@utils/post";

import { VaultNotCreatedError } from "@/errors/VaultNotCreated";
import { vaultSchema } from "@/schemas/vault";
import type { Vault } from "@/types/vault";
import { UserNotFoundError } from "@errors/UserNotFound";

export async function fetchVault(): Promise<Vault> {
	const response = await post("/api/vault");

	if (response.status === 404) {
		throw new UserNotFoundError();
	}

	const data = await response.json();
	if (data.vault === "") throw new VaultNotCreatedError();

	try {
		const vault = vaultSchema.parse(JSON.parse(data.vault));
		return vault;
	} catch {
		throw new Error("Invalid vault data received from server");
	}
}
