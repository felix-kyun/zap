import { fetchVault } from "@services/vault.service";

export async function vaultLoader() {
	await new Promise((resolve) => setTimeout(resolve, 2000));
	const vault = await fetchVault();
	return vault;
}
