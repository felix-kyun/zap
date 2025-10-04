import type {
	Vault,
	LockedVault,
	UnlockedVault,
	VaultItem,
	VaultUnlockData,
} from "@/types/vault";
import sodium from "libsodium-wrappers-sumo";
import { vaultItemSchema, vaultSchema } from "@/schemas/vault";
import { post } from "@utils/post";
import { VaultNotCreatedError } from "@/errors/VaultNotCreated";
import { AppError } from "@/errors/AppError";

await sodium.ready;

export function createInitialVault(): UnlockedVault {
	const salt = sodium.to_base64(
		sodium.randombytes_buf(sodium.crypto_pwhash_SALTBYTES),
	);

	return {
		state: "unlocked",
		salt,
		items: [],
		meta: {
			version: "1.0",
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		},
		settings: {
			autoLockTimeout: 300000, // 5 minutes
		},
	};
}

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

export function unlockVault(
	key: string,
	{ salt, meta, settings, items }: LockedVault,
): UnlockedVault {
	// verify key by decrypting unlock data

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

export function createItemBase(
	name: string,
	notes?: string,
): Pick<VaultItem, "id" | "createdAt" | "updatedAt" | "name" | "notes"> {
	return {
		id: crypto.randomUUID(),
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		name,
		notes,
	};
}

export function createLoginItem({
	name,
	notes,
	url,
	username,
	password,
}: VaultItem & { type: "login" }) {
	return {
		type: "login",
		...createItemBase(name, notes),
		url,
		username,
		password,
	};
}

export async function fetchVault(): Promise<Vault> {
	const response = await post("/api/vault");

	const data = await response.json();
	if (data.vault === "") throw new VaultNotCreatedError();

	try {
		const vault = vaultSchema.parse(JSON.parse(data.vault));
		return vault;
	} catch {
		throw new Error("Invalid vault data");
	}
}

export async function saveVault(key: string, vault: Vault): Promise<void> {
	if (vault.state === "unlocked") vault = lockVault(key, vault);

	const response = await post("/api/vault/sync", {
		vault: JSON.stringify(vault),
	});

	if (!response.ok) {
		throw new AppError("Failed to save vault");
	}
}
