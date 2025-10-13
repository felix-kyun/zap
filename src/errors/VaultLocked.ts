import { AppError } from "./AppError";

export class VaultLockedError extends AppError {
	constructor() {
		super("Vault is locked");
		this.name = "VaultNotFoundError";
		Object.setPrototypeOf(this, new.target.prototype);
	}
}
