import { Utils } from "@services/utils";

import type { VaultMethods, WorkerResponse, WorkerTask } from "@/types/worker";

type Resolver<T extends keyof VaultMethods> = (
	value: WorkerResponse<T>,
) => void;

// We take a function here to create the worker
// This is done so that vite can process web worker imports correctly
// vite requires code like new Worker(new URL("valid-path", import.meta.url)) to be present
// at build time to bundle the worker correctly
type WorkerCreator = () => Worker;

export class WorkerPool<T extends keyof VaultMethods> {
	private workers: Worker[] = [];
	private registeredWorkers: Worker[] = [];
	private queue: Array<WorkerTask<T>> = [];
	private resolvers: Map<string, Resolver<T>> = new Map();

	constructor(
		creator: WorkerCreator,
		poolSize: number = Math.round(navigator.hardwareConcurrency / 2) || 4,
	) {
		for (let i = 0; i < poolSize; i++) {
			const worker = creator();
			this.registeredWorkers.push(worker);
			this.workers.push(worker);

			worker.onmessage = async (event: MessageEvent) => {
				const response = event.data as WorkerResponse<T>;

				const resolve = this.resolvers.get(response.id);
				if (!resolve) return;

				if ("error" in response) {
					resolve({ id: response.id, error: response.error });
				} else {
					resolve({ id: response.id, result: response.result });
				}

				this.resolvers.delete(response.id);
				this.workers.push(worker);
				this.runNext();
			};
		}
	}

	execute(
		method: T,
		...args: Parameters<VaultMethods[T]>
	): Promise<WorkerResponse<T>> {
		return new Promise((resolve) => {
			const id = Utils.generateUUID();
			this.resolvers.set(id, resolve);
			this.queue.push({ id, method, args });
			this.runNext();
		});
	}

	private runNext() {
		if (this.queue.length === 0 || this.workers.length === 0) return;
		const worker = this.workers.shift();
		if (!worker) return;

		const task = this.queue.shift();
		if (!task) {
			this.workers.push(worker);
			return;
		}

		worker.postMessage(task);
	}

	terminate() {
		this.registeredWorkers.forEach((worker) => worker.terminate());
	}
}
