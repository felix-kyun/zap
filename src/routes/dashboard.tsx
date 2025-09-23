import { useEffect } from "react";
import { useAsync } from "../hooks/useAsync";
import { logout as logoutRequest } from "../services/auth.service";
import { useStore } from "../stores/store";
import { useUser } from "../hooks/useUser";
import { useNavigate } from "react-router-dom";

export function Dashboard() {
	const name = useUser((state) => state.name);
	const logout = useAsync(logoutRequest);
	const clearUser = useStore((state) => state.clearUser);
	const navigate = useNavigate();

	const handleLogout = async (e: React.SyntheticEvent) => {
		e.preventDefault();
		logout.run();
	};

	useEffect(() => {
		if (logout.status === "success") {
			clearUser();
			navigate("/login");
		}
	}, [logout, clearUser, navigate]);

	if (logout.error) throw new Error("An error occurred during logout");

	return (
		<div>
			<h1>Dashboard</h1>
			<p>Welcome to the dashboard!</p>
			{name && <p>Hello, {name}!</p>}
			<button
				onClick={handleLogout}
				disabled={logout.status === "loading"}
			>
				{logout.status === "loading" ? "Logging out..." : "Logout"}
			</button>
		</div>
	);
}
