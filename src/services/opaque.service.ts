import * as opaque from "@serenity-kit/opaque";

import type { Nullable } from "@/types/utils";

class OpaqueService {
	private constructor() {}

	static async initialize() {
		await opaque.ready;
		return new OpaqueService();
	}

	#password: Nullable<string> = null;
	#registrationState: Nullable<string> = null;
	#loginState: Nullable<string> = null;

	startRegistration(password: string) {
		const { clientRegistrationState, registrationRequest } =
			opaque.client.startRegistration({
				password,
			});

		this.#password = password;
		this.#registrationState = clientRegistrationState;

		return registrationRequest;
	}

	finishRegistration(response: string) {
		if (!this.#registrationState || !this.#password) {
			throw new Error("Registration not started properly");
		}

		const { registrationRecord } = opaque.client.finishRegistration({
			password: this.#password,
			registrationResponse: response,
			clientRegistrationState: this.#registrationState,
		});

		return registrationRecord;
	}

	startLogin(password: string) {
		const { clientLoginState, startLoginRequest } =
			opaque.client.startLogin({
				password,
			});

		this.#password = password;
		this.#loginState = clientLoginState;

		return startLoginRequest;
	}

	finishLogin(response: string) {
		if (!this.#loginState || !this.#password) {
			throw new Error("Login not started properly");
		}

		const ret = opaque.client.finishLogin({
			password: this.#password,
			clientLoginState: this.#loginState,
			loginResponse: response,
		});

		if (!ret) {
			throw new Error("Invalid Credentials");
		}

		return ret.finishLoginRequest;
	}
}

export const Opaque = await OpaqueService.initialize();
