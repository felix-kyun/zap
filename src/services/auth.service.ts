import { userInfoSchema, type UserInfo } from "@/schemas/user";
import { post } from "@utils/post";

export async function login(username: string, password: string) {
	const response = await post("/api/auth/login", { username, password });

	if (!response.ok) {
		throw new Error("Login failed");
	}

	return response.json();
}

export async function signup(data: {
	username: string;
	password: string;
	email: string;
	name: string;
}) {
	const response = await post("/api/users", data);

	if (!response.ok) {
		throw new Error("Signup failed");
	}

	return response.json();
}

export async function logout() {
	const response = await post("/api/auth/logout");

	if (!response.ok) {
		throw new Error("Logout failed");
	}
}

export async function checkAuthState(): Promise<boolean> {
	const response = await post("/api/auth/status");

	return response.ok;
}

export async function fetchUser(): Promise<UserInfo> {
	const response = await post("/api/auth/me");

	if (!response.ok) {
		throw new Error("Failed to fetch user");
	}

	try {
		const data = await response.json();
		const userInfo = userInfoSchema.parse(data);

		return userInfo;
	} catch {
		throw new Error("Invalid user data received from server");
	}
}
