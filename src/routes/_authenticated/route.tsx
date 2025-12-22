import { useThrottle } from "@hooks/useThrottle";
import { Auth } from "@services/auth.service";
import { Server } from "@services/server.service";
import { useStore } from "@stores/store";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useCallback, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useShallow } from "zustand/shallow";

type AuthenticatedLoaderData = Promise<{
	vault: Awaited<ReturnType<typeof Server.fetchVault>>;
	user: Awaited<ReturnType<typeof Auth.fetchUser>>;
}>;

export const Route = createFileRoute("/_authenticated")({
	beforeLoad: async () => {
		const authenticated = await Auth.checkAuthState();

		if (!authenticated)
			throw redirect({
				to: "/login",
			});
	},
	loader: async (): AuthenticatedLoaderData => {
		const vault = useStore.getState().vault;
		const user = useStore.getState().user;

		return {
			vault: vault ? vault : await Server.fetchVault(),
			user: user ? user : await Auth.fetchUser(),
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

	// auto lock
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const { state, lockVault, setting } = useStore(
		useShallow(({ vault, lockVault }) => ({
			state: vault?.state,
			lockVault,
			setting: vault?.settings,
		})),
	);

	const setVaultAutoLock = useCallback(() => {
		const gracePeriod = 10 * 1000;
		if (state === "unlocked") {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
				toast.dismiss("auto-lock");
			}

			timeoutRef.current = setTimeout(
				() => {
					toast.loading("Auto locking vault in 10 seconds...", {
						id: "auto-lock",
						duration: gracePeriod,
					});

					timeoutRef.current = setTimeout(() => {
						lockVault();
					}, gracePeriod);
				},
				setting?.autoLockTimeout || 5 * 60 * 1000,
			);
		}
	}, [lockVault, setting, state]);

	const resetTimeout = useThrottle(() => {
		if (timeoutRef.current) {
			setVaultAutoLock();
		}
	}, 500);

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
	}, [state, setting, setVaultAutoLock]);

	useEffect(() => {
		const events = [
			"mousemove",
			"mousedown",
			"keydown",
			"touchstart",
			"scroll",
			"click",
		];

		const options = { passive: true, capture: true };

		for (const event of events)
			window.addEventListener(event, resetTimeout, options);

		return () => {
			for (const event of events)
				window.removeEventListener(event, resetTimeout, options);
		};
	}, [resetTimeout]);

	if (!currentUser || !currentVault) {
		return null;
	}

	return <Outlet />;
}
