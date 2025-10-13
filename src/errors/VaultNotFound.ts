import { AppError } from "./AppError";

export class VaultNotFoundError extends AppError {
	constructor() {
		super("Vault not loaded");
		this.name = "VaultNotFoundError";
		Object.setPrototypeOf(this, new.target.prototype);
	}
}
