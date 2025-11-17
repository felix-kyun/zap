import { AppError } from "@errors/AppError";

export class VaultNotCreatedError extends AppError {
	constructor() {
		super("Vault does not exist, Please create a vault first.");
		this.name = "VaultNotCreatedError";
		Object.setPrototypeOf(this, new.target.prototype);
	}
}
