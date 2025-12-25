import { v4 as uuidv4 } from "uuid";

class UtilsService {
	generateUUID(): string {
		if (crypto && crypto.randomUUID) {
			return crypto.randomUUID();
		}
		return uuidv4();
	}

	findAndRemove<T>(arr: T[], predicate: (item: T) => boolean): T | null {
		const index = arr.findIndex(predicate);
		if (index === -1) {
			return null;
		}
		const [removedItem] = arr.splice(index, 1);
		return removedItem;
	}
}

export const Utils = new UtilsService();
