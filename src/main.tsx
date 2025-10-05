import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { CustomToast } from "@components/CustomToast";
import { ErrorHandler } from "@components/ErrorComponent";
import "@/index.css";

import { routeTree } from "./routeTree.gen";

const router = createRouter({
	routeTree,
	defaultPreload: "intent",
	defaultStaleTime: 5000,
	scrollRestoration: true,
	defaultErrorComponent: ErrorHandler,
});

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

const rootElement = document.getElementById("root")!;

if (!rootElement.innerHTML) {
	const root = createRoot(rootElement);
	root.render(
		<StrictMode>
			<CustomToast />
			<RouterProvider router={router} />
		</StrictMode>,
	);
}
