import vaultService from "@services/vault.worker.service.js";

export type VaultMethods = typeof vaultService;

export async function createVaultWorker<T extends keyof VaultMethods>(
	method: T,
	...args: Parameters<VaultMethods[T]>
): Promise<ReturnType<VaultMethods[T]>> {
	const worker = new Worker(new URL("./../utils/sw.js", import.meta.url), {
		type: "module",
	});

	return new Promise((resolve, reject) => {
		worker.onerror = (error) => {
			worker.terminate();
			reject(error);
		};

		worker.onmessage = (event) => {
			worker.terminate();

			if (event.data && event.data.error) {
				reject(new Error(event.data.error));
			}
			resolve(event.data as ReturnType<VaultMethods[T]>);
		};

		worker.postMessage({ method, args });
	});
}
