// @Cacheable
export function Cacheable<TArgs extends unknown[], TReturn>(
	value: (...args: TArgs) => TReturn,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	_context: ClassMethodDecoratorContext,
) {
	const cache: Map<string, TReturn> = new Map();

	return function (this: unknown, ...args: TArgs): TReturn {
		const key = JSON.stringify(args);

		if (cache.has(key)) {
			return cache.get(key)!;
		}

		const result = value.apply(this, args);
		cache.set(key, result);
		return result;
	};
}
