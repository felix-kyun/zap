import { InvalidMasterPassword } from "@/errors/InvalidMasterPassword";
import { UnauthError } from "@/errors/UnauthError";
import { VaultNotCreatedError } from "@/errors/VaultNotCreated";
import { useEffect } from "react";
import { useLocation, useNavigate, useRouteError } from "react-router-dom";

export function ErrorRoute() {
    const error = useRouteError();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (error instanceof VaultNotCreatedError) {
            // redirect to new vault creation page
            navigate("/init", { replace: true });
            return;
        }

        if (error instanceof UnauthError) {
            navigate(`/login?from=${encodeURIComponent(location.pathname)}`, {
                replace: true,
            });
        }

        if (error instanceof InvalidMasterPassword) {
            navigate(`/unlock?from=${encodeURIComponent(location.pathname)}`, {
                replace: true,
            });
        }
    }, [error, navigate, location]);

    // check for 404
    if (
        error &&
        typeof error === "object" &&
        "status" in error &&
        error.status === 404
    )
        return (
            <div>
                <h1>404 - Not Found</h1>
                <p>Sorry, the page you are looking for does not exist.</p>
            </div>
        );

    return (
        <div>
            <h1>Oops! </h1>
            <p> Sorry, an unexpected error has occurred.</p>
            <p>
                <code>{(error as Error).message || JSON.stringify(error)}</code>
            </p>
        </div>
    );
}
