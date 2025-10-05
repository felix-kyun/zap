import { UnauthError } from "@/errors/UnauthError";
import Cookies from "js-cookie";

async function _fetch(
	url: string,
	options: RequestInit = {},
	body: Record<string, unknown> = {},
) {
	return fetch(url, {
		method: "POST",
		credentials: "include",
		redirect: "follow",
		headers: {
			"Content-Type": "application/json",
			"X-CSRF-Token": Cookies.get("csrf_token") || "",
		},
		body: JSON.stringify({
			...body,
		}),
		...options,
	});
}

export async function post(
	url: string,
	data: Record<string, unknown> = {},
	retryOnUnauthorized: boolean = true,
) {
	const token = Cookies.get("csrf_token");

	// if no csrf token, fetch one
	if (!token) {
		await _fetch("/api/csrf");
	}

	let response = await _fetch(url, {}, data);

	if (retryOnUnauthorized && !response.ok && response.status === 401) {
		// unauthorized, try to refresh token
		const refreshResponse = await _fetch("/api/auth/refresh");
		if (!refreshResponse.ok && refreshResponse.status === 401)
			throw new UnauthError();

		response = await _fetch(url, {}, data);
	}

	return response;
}
