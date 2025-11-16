import { checkAuthState, fetchUser } from "@services/auth.service";
import { fetchVault } from "@services/server.service";
import { useStore } from "@stores/store";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useCallback, useEffect, useRef } from "react";
import { useShallow } from "zustand/shallow";

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
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const { state, lockVault, setting } = useStore(
		useShallow(({ vault, lockVault }) => ({
			state: vault?.state,
			lockVault,
			setting: vault?.settings,
		})),
	);
	const setVaultAutoLock = useCallback(() => {
		if (state === "unlocked") {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
			timeoutRef.current = setTimeout(
				() => {
					lockVault();
				},
				// setting?.autoLockTimeout || 5 * 60 * 1000,
				10000,
			);
		}
	}, [lockVault, setting, state]);

	useEffect(() => {
		if (!currentUser) setUser(user);
		// dont include vault itself or it will run on logout
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user, setUser]);

	useEffect(() => {
		if (!currentVault) setVault(vault);
		// dont include vault itself or it will run on logout
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [vault, setVault]);

	// auto lock
	useEffect(() => {
		setVaultAutoLock();

		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
				timeoutRef.current = null;
			}
		};
	}, [state, setting]);

	useEffect(() => {
		const events = [
			"mousemove",
			"mousedown",
			"keydown",
			"touchstart",
			"scroll",
			"click",
		];

		const resetTimeout = () => {
			if (timeoutRef.current) {
				setVaultAutoLock();
			}
		};

		for (const event of events)
			window.addEventListener(event, resetTimeout);

		return () => {
			for (const event of events)
				window.removeEventListener(event, resetTimeout);
		};
	}, []);

	if (!currentUser || !currentVault) {
		return null;
	}

	return <Outlet />;
}
