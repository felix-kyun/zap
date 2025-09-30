import z from "zod";

export const initialLoginSchema = z.object({
	session: z.string(),
	response: z.string(),
});

export type InitialLoginResponse = z.infer<typeof initialLoginSchema>;

export const loginSchema = z.object({
	id: z.string(),
	email: z.string(),
	username: z.string(),
});

export type LoginResponse = z.infer<typeof loginSchema>;
