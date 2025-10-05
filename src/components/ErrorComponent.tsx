import { UnauthError } from "@/errors/UnauthError";
import { VaultNotCreatedError } from "@/errors/VaultNotCreated";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type ErrorComponentProps = {
	title?: string;
	message?: string;
};
function ErrorComponent({
	title = "Sorry, an unexpected error has occurred.",
	message,
}: ErrorComponentProps) {
	return (
		<div>
			<h1>Oops! </h1>
			<p> {title} </p>
			<p>
				<code>{message}</code>
			</p>
		</div>
	);
}

export function ErrorHandler({ error }: { error: unknown }) {
	const navigate = useNavigate();
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
		} else {
			setHandled(false);
		}
	}, [error, navigate, setHandled]);

	if (!handled)
		return (
			<ErrorComponent title="An error occurred" message={String(error)} />
		);
}
