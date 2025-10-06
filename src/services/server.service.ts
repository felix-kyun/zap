import { VaultNotCreatedError } from "@/errors/VaultNotCreated";
import { vaultSchema } from "@/schemas/vault";
import { post } from "@utils/post";
import type { Vault } from "@/types/vault";

export async function fetchVault(): Promise<Vault> {
	const response = await post("/api/vault");

	const data = await response.json();
	if (data.vault === "") throw new VaultNotCreatedError();

	try {
		const vault = vaultSchema.parse(JSON.parse(data.vault));
		return vault;
	} catch {
		throw new Error("Invalid vault data received from server");
	}
}
