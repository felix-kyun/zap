import z from "zod";

export const userInfoSchema = z.object({
	id: z.string(),
	username: z.string(),
	email: z.string(),
});

export type UserInfo = z.infer<typeof userInfoSchema>;
