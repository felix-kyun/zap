// generic error class,
// derive to create specific errors
//
// export class YourError extends AppError {
//    constructor(message: string) {
//         super(message);
//         this.name = "YourError";
//         Object.setPrototypeOf(this, new.target.prototype);
//      }
// }
//
export class AppError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "AppError";
		Object.setPrototypeOf(this, new.target.prototype);
	}
}
