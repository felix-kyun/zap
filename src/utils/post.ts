import { serverFetch } from "./serverFetch";

export async function post(url: string, data: Record<string, unknown> = {}) {
	return serverFetch(url, "POST", data);
}
