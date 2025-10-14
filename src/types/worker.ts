// dont use relative paths as workers can load them
import vaultWorkerService from "../services/vault.worker.service";

export type VaultMethods = typeof vaultWorkerService;
export type VaultMethodParameters<T extends keyof VaultMethods> = Parameters<
	VaultMethods[T]
>;
export type VaultMethodReturnType<T extends keyof VaultMethods> = Awaited<
	ReturnType<VaultMethods[T]>
>;

export type WorkerTask<T extends keyof VaultMethods> = {
	id: string;
	method: T;
	args: VaultMethodParameters<T>;
};

export type WorkerResponse<T extends keyof VaultMethods> =
	| {
			id: string;
			result: VaultMethodReturnType<T>;
	  }
	| {
			id: string;
			error: string;
	  };
