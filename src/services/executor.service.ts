import { WorkerPool } from "@/class/WorkerPool";
import type {
	VaultMethodParameters,
	VaultMethodReturnType,
	VaultMethods,
} from "@/types/worker";

type CreatorFn = () => Worker;

class ExecutorService {
	#creator: CreatorFn;

	constructor(creator: CreatorFn) {
		this.#creator = creator;
	}

	async execute<T extends keyof VaultMethods>(
		method: T,
		...args: VaultMethodParameters<T>
	): Promise<VaultMethodReturnType<T>> {
		const worker = new WorkerPool(this.#creator, 1);
		const response = await worker.execute(method, ...args);
		worker.terminate();

		if ("error" in response) {
			throw new Error(response.error);
		}

		return response.result as VaultMethodReturnType<T>;
	}

	parallelExecuter(threads?: number) {
		const pool = new WorkerPool(this.#creator, threads);

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
}

const vaultWorkerCreator = () =>
	new Worker(new URL("../worker/sw.js", import.meta.url), {
		type: "module",
	});

export const Executor = new ExecutorService(vaultWorkerCreator);
