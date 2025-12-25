import { UserNotFoundError } from "@errors/UserNotFound";
import { Auth } from "@services/auth";
import { useLocation, useNavigate } from "@tanstack/react-router";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { UnauthError } from "@/errors/UnauthError";
import { VaultLockedError } from "@/errors/VaultLocked";
import { VaultNotCreatedError } from "@/errors/VaultNotCreated";

type ErrorComponentProps = {
	message: string;
};

// oops! followed by message
function ErrorComponent({ message }: ErrorComponentProps) {
	return (
		<div className="flex flex-col items-center justify-center gap-4 min-h-screen text-neutral-500">
			<span className="text-7xl font-extrabold">Oops!</span>
			<h1 className="text-2xl font-semibold">
				{message || "An unexpected error occurred."}
			</h1>
		</div>
	);
}

export function ErrorHandler({ error }: { error: unknown }) {
	const navigate = useNavigate();
	const location = useLocation();
	const [handled, setHandled] = useState(true);

	useEffect(() => {
		if (error instanceof UnauthError) {
			toast.error("Not authenticated, please log in.", {
				id: "unauthenticated",
			});

			navigate({
				to: "/login",
			});
		} else if (error instanceof VaultNotCreatedError) {
			toast.error("No vault found, please create one.", {
				id: "vault-not-created",
			});

			navigate({
				to: "/create",
			});
		} else if (error instanceof VaultLockedError) {
			navigate({
				to: "/unlock",
				search: {
					redirect: location.pathname + location.search,
				},
			});
		} else if (error instanceof UserNotFoundError) {
			Cookies.remove("authenticated");
			Auth.logout().then(() =>
				navigate({
					to: "/login",
				}),
			);
		} else {
			setHandled(false);
		}
	}, [error, navigate, setHandled, location]);

	if (!handled) {
		if (error instanceof Error)
			return <ErrorComponent message={error.message} />;
		else return <ErrorComponent message={String(error)} />;
	}
}
