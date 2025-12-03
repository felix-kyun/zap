import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { AnimatePresence } from "motion/react";

function RootLayout() {
	return (
		<>
			<AnimatePresence mode="wait">
				<Outlet />
			</AnimatePresence>
			<TanStackRouterDevtools position="top-right" />
		</>
	);
}

export const Route = createRootRoute({ component: RootLayout });
