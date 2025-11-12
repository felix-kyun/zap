import { UnlockModal } from "@components/UnlockModal";
import { useModal } from "@hooks/useModal";
import { useStore } from "@stores/store";
import { createFileRoute, redirect } from "@tanstack/react-router";
import z from "zod";

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
	const [ManagedUnlockModal] = useModal(UnlockModal);

	return ManagedUnlockModal;
}
