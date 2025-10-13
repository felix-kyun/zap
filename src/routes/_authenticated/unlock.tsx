import { UnlockModal } from "@components/UnlockModal";
import { useStore } from "@stores/store";
import { createFileRoute, redirect } from "@tanstack/react-router";
import z from "zod";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/unlock")({
	component: RouteComponent,
	validateSearch: z.object({ redirect: z.string().optional() }),
	beforeLoad: async ({ search }) => {
		if (useStore.getState().vault?.state !== "locked") {
			throw redirect({
				to: search.redirect ?? "/dashboard",
			});
		}
	},
});

function RouteComponent() {
	const [modalOpen, setModalOpen] = useState(true);

	return <UnlockModal open={modalOpen} close={() => setModalOpen(false)} />;
}
