import { AppError } from "@errors/AppError";

export class UnauthError extends AppError {
	constructor() {
		super("Unauthorized, Please login again.");
		this.name = "UnauthError";
		Object.setPrototypeOf(this, new.target.prototype);
	}
}
