import { createFileRoute, redirect } from "@tanstack/react-router";

function Index() {
	return null;
}

export const Route = createFileRoute("/")({
	component: Index,
	loader: () =>
		redirect({
			to: "/dashboard",
		}),
});
