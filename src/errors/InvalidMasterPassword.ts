import { AppError } from "@errors/AppError";

export class InvalidMasterPassword extends AppError {
	constructor() {
		super("Invalid master password, redirecting to unlock page.");
		this.name = "InvalidMasterPassword";
		Object.setPrototypeOf(this, new.target.prototype);
	}
}
