import vaultWorkerService from "../services/vault.worker.service";
import sodium from "libsodium-wrappers-sumo";

type VaultMethods = typeof vaultWorkerService;

self.onmessage = async function <T extends keyof VaultMethods>(
	event: MessageEvent,
) {
	const { method, args } = event.data as {
		method: T;
		args: Parameters<VaultMethods[T]>;
	};

	await sodium.ready;

	try {
		// @ts-expect-error why ts, just why?
		self.postMessage(vaultWorkerService[method](...args));
	} catch (error) {
		self.postMessage({ error: (error as Error)?.message ?? String(error) });
	}
};
