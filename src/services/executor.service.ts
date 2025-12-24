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

	#singleExecutor: WorkerPool<keyof VaultMethods> | null = null;
	#autoTerminateTimeout: ReturnType<typeof setTimeout> | null = null;
	async execute<T extends keyof VaultMethods>(
		method: T,
		...args: VaultMethodParameters<T>
	): Promise<VaultMethodReturnType<T>> {
		let worker: WorkerPool<keyof VaultMethods>;

		if (this.#singleExecutor) {
			worker = this.#singleExecutor;
			if (this.#autoTerminateTimeout) {
				clearTimeout(this.#autoTerminateTimeout);
				this.#autoTerminateTimeout = null;
			}
		} else {
			worker = new WorkerPool(this.#creator, 1);
			this.#singleExecutor = worker;
		}

		const response = await worker.execute(method, ...args);

		if ("error" in response) {
			throw new Error(response.error);
		}

		this.#autoTerminateTimeout = setTimeout(() => {
			if (this.#singleExecutor) {
				this.#singleExecutor.terminate();
				this.#singleExecutor = null;
			}
		}, 60 * 1000);

		return response.result as VaultMethodReturnType<T>;
	}

	createExecutor(threads?: number) {
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

		return { exec, terminate } as const;
	}
}

const vaultWorkerCreator = () =>
	new Worker(new URL("../worker/sw.js", import.meta.url), {
		type: "module",
	});

export const Executor = new ExecutorService(vaultWorkerCreator);
