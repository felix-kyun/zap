import Cookies from "js-cookie";

export async function _fetch(
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
