import { AppError } from "@errors/AppError";

export class UserNotFoundError extends AppError {
	constructor() {
		super("User not found");
		this.name = "UserNotFoundError";
		Object.setPrototypeOf(this, new.target.prototype);
	}
}
