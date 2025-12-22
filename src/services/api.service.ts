import { UnauthError } from "@errors/UnauthError";
import Cookies from "js-cookie";

type HttpMethod = "POST" | "GET" | "PUT" | "DELETE" | "PATCH";
type OptsWithoutMethod = Omit<RequestInit, "method">;

class ApiService {
	async #fetch<T extends HttpMethod>(
		url: string,
		method: T,
		...args: T extends "GET"
			? [options?: Omit<OptsWithoutMethod, "body">]
			: [body?: object, options?: OptsWithoutMethod]
	) {
		let body, options;
		if (method === "GET")
			options = args[0] as Omit<OptsWithoutMethod, "body"> | undefined;
		else {
			body = args[0] as object | undefined;
			options = args[1] as OptsWithoutMethod | undefined;
		}

		const opts: RequestInit = {
			credentials: "include",
			redirect: "follow",
			headers: {
				"Content-Type": "application/json",
				"X-CSRF-Token": Cookies.get("csrf_token") || "",
			},
			...options,
		};

		opts.body = opts.method === "GET" ? undefined : JSON.stringify(body);

		return fetch(url, opts);
	}

	async fetch<T extends HttpMethod, U extends object>(
		url: string,
		method: T,
		...args: T extends "GET" ? [] : [data?: U]
	) {
		const token = Cookies.get("csrf_token");

		// if no csrf token, fetch one
		if (!token) {
			await this.#fetch("/api/csrf", "GET");
		}

		const cookedFetch = () => this.#fetch(url, method, ...args);

		let response = await cookedFetch();

		if (!response.ok && response.status === 401) {
			// unauthorized, try to refresh token
			const refreshResponse = await this.#fetch(
				"/api/auth/refresh",
				"POST",
			);
			if (!refreshResponse.ok && refreshResponse.status === 401)
				throw new UnauthError();

			response = await cookedFetch();
		}

		return response;
	}

	async post(url: string, data: Record<string, unknown> = {}) {
		return this.fetch(url, "POST", data);
	}
}

export const Api = new ApiService();
