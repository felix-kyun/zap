import z from "zod";

import type { Vault } from "@/types/vault";

export const vaultTypeSchema = z.enum([
	"login",
	"note",
	"card",
	"identity",
	"custom",
]);

const vaultItemBaseSchema = z.object({
	id: z.string(),
	type: vaultTypeSchema,
	name: z.string().min(1, "Name is required"),
	createdAt: z.string(),
	updatedAt: z.string(),
	tags: z.array(z.object({ value: z.string() })),
});

const loginItemSchema = vaultItemBaseSchema.extend({
	type: z.literal("login"),
	url: z.string(),
	username: z.string(),
	password: z.string().min(1, "Password is required"),
});

const noteItemSchema = vaultItemBaseSchema.extend({
	type: z.literal("note"),
	content: z.string(),
});

const cardItemSchema = vaultItemBaseSchema.extend({
	type: z.literal("card"),
	cardHolder: z.string(),
	cardNumber: z.string(),
	cardExpiry: z.string(),
	cardCVV: z.string().optional(),
});

const identityItemSchema = vaultItemBaseSchema.extend({
	type: z.literal("identity"),
	fullName: z.string(),
	dateOfBirth: z.string().optional(),
	address: z.string().optional(),
	phoneNumber: z.string().optional(),
	email: z.string().optional(),
});

const customItemSchema = vaultItemBaseSchema.extend({
	type: z.literal("custom"),
	fields: z.record(z.string(), z.string()),
});

export const vaultItemSchema = z.discriminatedUnion("type", [
	loginItemSchema,
	noteItemSchema,
	cardItemSchema,
	identityItemSchema,
	customItemSchema,
]);

export const encryptedVaultItemSchema = z.object({
	id: z.string(),
	nonce: z.string(),
	ciphertext: z.string(),
});

const vaultMetaSchema = z.object({
	version: z.string(),
});

const vaultSettingsSchema = z.object({
	autoLockTimeout: z.number(),
});

const vaultUnlockDataSchema = z.object({
	nonce: z.string(),
	ciphertext: z.string(),
});

const vaultBaseSchema = z.object({
	state: z.enum(["locked", "unlocked"]),
	salt: z.string(),
	meta: vaultMetaSchema,
	settings: vaultSettingsSchema,
	unlock: vaultUnlockDataSchema,
	createdAt: z.string(),
	updatedAt: z.string(),
});

export const encryptedVaultSchema = vaultBaseSchema.extend({
	state: z.literal("locked"),
	items: z.array(encryptedVaultItemSchema),
});

export const decryptedVaultSchema = vaultBaseSchema.extend({
	state: z.literal("unlocked"),
	items: z.array(vaultItemSchema),
});

export const vaultSchema = z.discriminatedUnion("state", [
	decryptedVaultSchema,
	encryptedVaultSchema,
]);

// compile time check to match ts types and zod schema
// without using zod infered types

type ZodVault = z.infer<typeof vaultSchema>;
export const _typeCheckVault = {} as Vault satisfies ZodVault;
export const _typeCheckZodVault = {} as ZodVault satisfies Vault;
