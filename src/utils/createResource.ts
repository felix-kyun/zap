type Nullable<T> = T | null;
type ResourceFunction<T> = () => Promise<T>;
type ResourceState = "idle" | "loading" | "success" | "error";
type Resource<T> = {
	read: () => T;
};

const cache = new Map<string, Resource<unknown>>();

export function createResource<T>(key: string, fn: ResourceFunction<T>) {
	const cached = cache.get(key);
	if (cached) return cached as Resource<T>;

	let status: ResourceState = "idle";
	let data: Nullable<T> = null;
	let error: Nullable<unknown> = null;
	let promise: Nullable<Promise<T>> = null;

	const resource: Resource<T> = {
		read() {
			if (status === "success" && data) return data;
			if (status === "error" && error) throw error;
			if (status === "loading" && promise) throw promise;

			status = "loading";
			promise = fn()
				.then((result) => {
					status = "success";
					data = result;

					return result;
				})
				.catch((err) => {
					status = "error";
					error = err;
					throw err;
				});

			throw promise;
		},
	};

	cache.set(key, resource);
	return resource;
}

export function invalidateResource(key: string) {
	cache.delete(key);
}
