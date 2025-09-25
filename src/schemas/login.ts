import z from "zod";

export const loginSchema = z.object({
	id: z.string(),
	name: z.string(),
	email: z.string(),
	username: z.string(),
});

export type LoginResponse = z.infer<typeof loginSchema>;
