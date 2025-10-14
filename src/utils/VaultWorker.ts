import type {
	VaultMethodParameters,
	VaultMethodReturnType,
	VaultMethods,
} from "@/types/worker";
import { WorkerPool } from "./WorkerPool";

const workerPool = new WorkerPool("./sw.js", 4);

export async function execute<T extends keyof VaultMethods>(
	method: T,
	...args: VaultMethodParameters<T>
): Promise<VaultMethodReturnType<T>> {
	const response = await workerPool.execute(method, ...args);

	if ("error" in response) {
		throw new Error(response.error);
	}

	return response.result as VaultMethodReturnType<T>;
}
