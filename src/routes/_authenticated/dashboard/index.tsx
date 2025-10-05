import { useStore } from "@stores/store";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/dashboard/")({
	component: RouteComponent,
});

function RouteComponent() {
	// const { vault: loadedVault, user: loaderUser } = Route.useLoaderData();

	return (
		<div>
			<h1>Dashboard</h1>
		</div>
	);
}
