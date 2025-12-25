import { VaultWorker } from "../services/vault.worker";
import type {
	VaultMethodParameters,
	VaultMethodReturnType,
	VaultMethods,
	WorkerResponse,
	WorkerTask,
} from "../types/worker";

self.onmessage = async function <T extends keyof VaultMethods>(
	event: MessageEvent,
) {
	const { id, method, args } = event.data as WorkerTask<T>;

	await VaultWorker.ready();

	try {
		const response: WorkerResponse<T> = {
			id,
			result: (await VaultWorker[method](
				// @ts-expect-error i have zero idea why ts complains about the rest params
				// even after the type assertion
				...(args as VaultMethodParameters<T>),
			)) as VaultMethodReturnType<T>,
		};
		self.postMessage(response);
	} catch (error) {
		self.postMessage({
			id,
			error: (error as Error)?.message ?? String(error),
		});
	}
};
