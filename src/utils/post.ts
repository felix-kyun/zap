import { _fetch } from "@utils/fetch";
import Cookies from "js-cookie";

import { UnauthError } from "@/errors/UnauthError";

export async function post(url: string, data: Record<string, unknown> = {}) {
	const token = Cookies.get("csrf_token");

	// if no csrf token, fetch one
	if (!token) {
		await _fetch("/api/csrf");
	}

	let response = await _fetch(url, {}, data);

	if (!response.ok && response.status === 401) {
		// unauthorized, try to refresh token
		const refreshResponse = await _fetch("/api/auth/refresh");
		if (!refreshResponse.ok && refreshResponse.status === 401)
			throw new UnauthError();

		response = await _fetch(url, {}, data);
	}

	return response;
}
