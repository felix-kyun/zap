import { _fetch } from "@utils/fetch";
import Cookies from "js-cookie";

import { UnauthError } from "@/errors/UnauthError";

type HttpMethod = "POST" | "GET" | "PUT" | "DELETE" | "PATCH";
export async function serverFetch<T extends {}>(
	url: string,
	method: HttpMethod,
	data?: T,
) {
	const token = Cookies.get("csrf_token");

	// if no csrf token, fetch one
	if (!token) {
		await _fetch("/api/csrf");
	}

	const cookedFetch = () =>
		_fetch(
			url,
			{
				method,
			},
			data,
		);

	let response = await cookedFetch();

	if (!response.ok && response.status === 401) {
		// unauthorized, try to refresh token
		const refreshResponse = await _fetch("/api/auth/refresh");
		if (!refreshResponse.ok && refreshResponse.status === 401)
			throw new UnauthError();

		response = await cookedFetch();
	}

	return response;
}
