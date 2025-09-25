import { useEffect, useState } from "react";
import { fetchUser } from "@services/auth.service";
import { useStore } from "@stores/store";
import type { UserSlice } from "@stores/userSlice";
import type { Store } from "@/types/store";
import { useAsync } from "@hooks/useAsync";
import { useLocation, useNavigate } from "react-router-dom";
import { useShallow } from "zustand/shallow";

type UserStateSelector<T> = (state: Store) => T;

export function useUser<
	T extends Partial<UserSlice> | UserSlice[keyof UserSlice],
>(selector: UserStateSelector<T>): T {
	const [called, setCalled] = useState(false);
	const { id, setUser } = useStore(
		useShallow(({ id, setUser }) => ({ id, setUser })),
	);
	const userState = useStore(selector);
	const { status, run, data } = useAsync(fetchUser);
	const location = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
		if (!id && !called && status === "idle") {
			run();
			setCalled(true);
		}
	}, [id, run, status, called]);

	useEffect(() => {
		if (status === "success" && data) {
			setUser({ ...data });
		}
	}, [setUser, data, status]);

	useEffect(() => {
		if (status === "error")
			navigate(`/login?from=${encodeURIComponent(location.pathname)}`);
	}, [status, location, navigate]);

	return userState;
}
