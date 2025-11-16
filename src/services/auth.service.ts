import Opaque from "@services/opaque.service";
import { post } from "@utils/post";
import Cookies from "js-cookie";

import {
	initialLoginSchema,
	type LoginResponse,
	loginSchema,
} from "@/schemas/login";
import { type UserInfo, userInfoSchema } from "@/schemas/user";

interface SignupData {
	username: string;
	password: string;
	email: string;
}

export async function signup({ username, password, email }: SignupData) {
	const { state, request } = Opaque.startRegistration(password);
	const initialResponse = await post("/api/register/start", {
		request,
		email,
	});

	if (!initialResponse.ok) {
		throw new Error("Registration initiation failed");
	}

	const { response } = await initialResponse.json();

	if (!response || typeof response !== "string")
		throw new Error("Invalid response from server");

	const record = Opaque.finishRegistration(password, response, state);

	const finalResponse = await post("/api/register/finish", {
		record,
		email,
		username,
	});

	if (!finalResponse.ok) throw new Error("Registration completion failed");

	return true;
}

interface LoginData {
	email: string;
	password: string;
}

export async function login({
	email,
	password,
}: LoginData): Promise<LoginResponse> {
	const { state, request } = Opaque.startLogin(password);

	const initialResponse = await post("/api/login/start", {
		request,
		email,
	});

	if (!initialResponse.ok) throw new Error("Login initiation failed");

	const { response, session } = initialLoginSchema.parse(
		await initialResponse.json(),
	);

	const finishRequest = Opaque.finishLogin(password, response, state);

	const finalResponse = await post("/api/login/finish", {
		request: finishRequest,
		session,
	});

	return loginSchema.parse(await finalResponse.json());
}

export async function logout() {
	const response = await post("/api/auth/logout");

	if (!response.ok) {
		throw new Error("Logout failed");
	}
}

export async function checkAuthState(): Promise<boolean> {
	if (Cookies.get("authenticated") === "true") return true;

	try {
		const response = await post("/api/auth/status");
		const data = await response.json();
		return response.ok && data && data?.authenticated === true;
	} catch {
		// handle UnauthError or else it will be redirected and cause a infinite loop
		return false;
	}
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
