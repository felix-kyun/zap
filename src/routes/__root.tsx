import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

function RootLayout() {
	return (
		<>
			<Outlet />
			<TanStackRouterDevtools position="top-right" />
		</>
	);
}

export const Route = createRootRoute({ component: RootLayout });
