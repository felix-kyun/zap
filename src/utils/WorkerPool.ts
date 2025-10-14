import type {
    VaultMethods,
    WorkerTask,
    WorkerResponse,
} from "../types/worker.js";

type Resolver<T extends keyof VaultMethods> = (
    value: WorkerResponse<T>,
) => void;

export class WorkerPool<T extends keyof VaultMethods> {
    private workers: Worker[] = [];
    private registeredWorkers: Worker[] = [];
    private queue: Array<WorkerTask<T>> = [];
    private resolvers: Map<string, Resolver<T>> = new Map();

    constructor(
        source: string,
        poolSize: number = Math.round(navigator.hardwareConcurrency / 2) || 4,
    ) {
        for (let i = 0; i < poolSize; i++) {
            const worker = new Worker(new URL(source, import.meta.url), {
                type: "module",
            });
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
            const id = crypto.randomUUID();
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
