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

export async function post(url: string, data: Record<string, unknown>) {
	const token = Cookies.get("csrf_token");

	// if no csrf token, fetch one
	if (!token) {
		await _fetch("/api/csrf");
	}

	let response = await _fetch(url, {}, data);

	if (!response.ok && response.status === 401) {
		// unauthorized, try to refresh token
		await _fetch("/api/auth/refresh");
		response = await _fetch(url, {}, data);
	}

	return response;
}
