export function findAndRemove<T>(
	arr: T[],
	predicate: (item: T) => boolean,
): T | null {
	const index = arr.findIndex(predicate);
	if (index === -1) {
		return null;
	}
	const [removedItem] = arr.splice(index, 1);
	return removedItem;
}
