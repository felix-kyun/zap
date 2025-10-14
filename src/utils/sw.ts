import type { WorkerTask, VaultMethods, WorkerResponse } from "../types/worker";
import vaultWorkerService from "../services/vault.worker.service";
import sodium from "libsodium-wrappers-sumo";

self.onmessage = async function <T extends keyof VaultMethods>(
	event: MessageEvent,
) {
	const { id, method, args } = event.data as WorkerTask<T>;

	await sodium.ready;

	try {
		const response: WorkerResponse<T> = {
			id,
			result: (await vaultWorkerService[method](
				// @ts-expect-error i have zero idea why ts complains about the rest params
				// even after the type assertion
				...(args as Parameters<VaultMethods[T]>),
			)) as WorkerResponse<T>["result"],
		};
		self.postMessage(response);
	} catch (error) {
		self.postMessage({ error: (error as Error)?.message ?? String(error) });
	}
};
