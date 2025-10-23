import type {
	VaultMethodParameters,
	VaultMethodReturnType,
	VaultMethods,
} from "@/types/worker";
import { WorkerPool } from "@/utils/WorkerPool";

const creator = () =>
	new Worker(new URL("./sw.js", import.meta.url), {
		type: "module",
	});

// execute limits to 1 thread
// used to handle light tasks
export async function execute<T extends keyof VaultMethods>(
	method: T,
	...args: VaultMethodParameters<T>
): Promise<VaultMethodReturnType<T>> {
	const worker = new WorkerPool(creator, 1);
	const response = await worker.execute(method, ...args);
	worker.terminate();

	if ("error" in response) {
		throw new Error(response.error);
	}

	return response.result as VaultMethodReturnType<T>;
}

// executeParallel uses multiple threads
// used to fan out heavy tasks
// also kills the thread after use to free up memory
export function parallelExecuter(threads?: number) {
	const pool = new WorkerPool(creator, threads);

	const exec = async <T extends keyof VaultMethods>(
		method: T,
		...args: VaultMethodParameters<T>
	): Promise<VaultMethodReturnType<T>> => {
		const response = await pool.execute(method, ...args);

		if ("error" in response) {
			throw new Error(response.error);
		}

		return response.result as VaultMethodReturnType<T>;
	};

	const terminate = () => pool.terminate();

	return [exec, terminate] as const;
}
