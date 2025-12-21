import Cookies from "js-cookie";

type OptsWithoutMethod = Omit<RequestInit, "method">;
type Method<T extends string> = {
	method: T;
};
type FetchOptions =
	| (Method<"GET"> & Omit<OptsWithoutMethod, "body">)
	| (Method<"POST" | "PUT" | "DELETE" | "PATCH"> & OptsWithoutMethod);

export async function _fetch(
	url: string,
	options: FetchOptions = {
		method: "POST",
	},
	body: Record<string, unknown> = {},
) {
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
