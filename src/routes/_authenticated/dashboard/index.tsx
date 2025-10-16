import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/dashboard/")({
	beforeLoad: async () => {
		throw redirect({
			to: "/dashboard/$type",
			params: { type: "all" },
		});
	},
});
