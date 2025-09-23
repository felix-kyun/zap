import { useRouteError } from "react-router-dom";

export function ErrorRoute() {
	const error = useRouteError();

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
