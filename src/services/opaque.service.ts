import * as opaque from "@serenity-kit/opaque";

await opaque.ready;

function startRegistration(password: string) {
    const { clientRegistrationState, registrationRequest } =
        opaque.client.startRegistration({
            password,
        });

    return {
        state: clientRegistrationState,
        request: registrationRequest,
    };
}

function finishRegistration(password: string, response: string, state: string) {
    const { registrationRecord } = opaque.client.finishRegistration({
        password,
        registrationResponse: response,
        clientRegistrationState: state,
    });

    return registrationRecord;
}

function startLogin(password: string) {
    const { clientLoginState, startLoginRequest } = opaque.client.startLogin({
        password,
    });

    return {
        state: clientLoginState,
        request: startLoginRequest,
    };
}

function finishLogin(password: string, response: string, state: string) {
    const ret = opaque.client.finishLogin({
        password,
        clientLoginState: state,
        loginResponse: response,
    });

    if (!ret) throw new Error("Invalid Credentials");
    return ret.finishLoginRequest;
}

export default {
    startRegistration,
    finishRegistration,
    startLogin,
    finishLogin,
};
