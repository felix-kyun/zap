import { Opaque } from "@services/opaque.service";
import Cookies from "js-cookie";

import {
	initialLoginSchema,
	type LoginResponse,
	loginSchema,
} from "@/schemas/login";
import { type UserInfo, userInfoSchema } from "@/schemas/user";

import { Api } from "./api.service";

interface SignupData {
	username: string;
	password: string;
	email: string;
}

interface LoginData {
	email: string;
	password: string;
}

class AuthService {
	private constructor() {}

	static async initialize() {
		return new AuthService();
	}

	async startSignup({
		password,
		email,
	}: Omit<SignupData, "username">): Promise<string> {
		const request = Opaque.startRegistration(password);
		const initialResponse = await Api.post("/api/register/start", {
			request,
			email,
		});

		if (!initialResponse.ok)
			throw new Error("Registration initiation failed");

		const { response } = await initialResponse.json();

		if (!response || typeof response !== "string")
			throw new Error("Invalid response from server");

		return response;
	}

	async finishSignup(
		{ username, email, otp }: SignupData & { otp: string },
		response: string,
	) {
		const record = Opaque.finishRegistration(response);

		const finalResponse = await Api.post("/api/register/finish", {
			record,
			email,
			username,
			otp,
		});

		if (!finalResponse.ok)
			throw new Error("Registration completion failed");

		return true;
	}
	async login({ email, password }: LoginData): Promise<LoginResponse> {
		const request = Opaque.startLogin(password);

		const initialResponse = await Api.post("/api/login/start", {
			request,
			email,
		});

		if (!initialResponse.ok) {
			if (initialResponse.status === 404) {
				throw new Error("User not found");
			}
			throw new Error("Login initiation failed");
		}

		const { response, session } = initialLoginSchema.parse(
			await initialResponse.json(),
		);

		const finishRequest = Opaque.finishLogin(response);

		const finalResponse = await Api.post("/api/login/finish", {
			request: finishRequest,
			session,
		});

		return loginSchema.parse(await finalResponse.json());
	}

	async logout() {
		const response = await Api.post("/api/auth/logout");

		if (!response.ok) {
			throw new Error("Logout failed");
		}
	}

	async checkAuthState(): Promise<boolean> {
		if (Cookies.get("authenticated") === "true") return true;

		try {
			const response = await Api.post("/api/auth/status");
			const data = await response.json();
			return response.ok && data && data?.authenticated === true;
		} catch {
			// handle UnauthError or else it will be redirected and cause a infinite loop
			return false;
		}
	}

	async fetchUser(): Promise<UserInfo> {
		const response = await Api.post("/api/auth/me");

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
}

export const Auth = await AuthService.initialize();
