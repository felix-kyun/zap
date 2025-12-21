import { VaultNotCreatedError } from "@/errors/VaultNotCreated";
import { vaultSchema } from "@/schemas/vault";
import type { Vault } from "@/types/vault";
import { UserNotFoundError } from "@errors/UserNotFound";
import { serverFetch } from "@utils/serverFetch";

export async function fetchVault(): Promise<Vault> {
	const response = await serverFetch("/api/vault", "GET");

	if (response.status === 404) {
		throw new UserNotFoundError();
	}

	let data: unknown;
	try {
		data = await response.json();
	} catch {
		throw new VaultNotCreatedError();
	}

	try {
		const vault = vaultSchema.parse({
			...(data as Object),
			// add discriminator
			state: "locked",
		});
		return vault;
	} catch (error) {
		if (import.meta.env.DEV)
			console.error("Vault schema validation error:", error);
		throw new Error("Invalid vault data received from server");
	}
}
