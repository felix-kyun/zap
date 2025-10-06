import { checkAuthState, fetchUser } from "@services/auth.service";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useStore } from "@stores/store";
import { useEffect } from "react";
import { useShallow } from "zustand/shallow";
import { fetchVault } from "@services/server.service";

type AuthenticatedLoaderData = Promise<{
	vault: Awaited<ReturnType<typeof fetchVault>>;
	user: Awaited<ReturnType<typeof fetchUser>>;
}>;

export const Route = createFileRoute("/_authenticated")({
	beforeLoad: async () => {
		const authenticated = await checkAuthState();

		if (!authenticated)
			throw redirect({
				to: "/login",
			});
	},
	loader: async (): AuthenticatedLoaderData => {
		const vault = useStore.getState().vault;
		const user = useStore.getState().user;

		return {
			vault: vault ? vault : await fetchVault(),
			user: user ? user : await fetchUser(),
		};
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { vault, user } = Route.useLoaderData();
	const {
		user: currentUser,
		vault: currentVault,
		setUser,
		setVault,
	} = useStore(
		useShallow(({ user, vault, setUser, setVault }) => ({
			user,
			vault,
			setUser,
			setVault,
		})),
	);

	useEffect(() => {
		if (!currentUser) setUser(user);
	}, [currentUser, setUser, user]);

	useEffect(() => {
		if (!currentVault) setVault(vault);
	}, [currentVault, setVault, vault]);

	return <Outlet />;
}
