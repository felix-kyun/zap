import {
	createRootRoute,
	Link,
	Outlet,
	useNavigate,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import logo from "@/assets/zap-black.png";
import { useStore } from "@stores/store";
import toast from "react-hot-toast";
import { logout } from "@services/auth.service";

function RootLayout() {
	const user = useStore((state) => state.user);
	const loggedIn = useStore((state) => state.loggedIn);
	const clearUser = useStore((state) => state.clearUser);
	const navigate = useNavigate();

	const handleLogout = async () => {
		try {
			await logout();
			clearUser();
			toast.success("Logged out successfully.");
			navigate({ to: "/login" });
		} catch {
			toast.error("Error logging out. Please try again.");
		}
	};

	return (
		<div className="flex flex-col min-h-screen">
			<div className="p-2 flex gap-2 h-10">
				<img src={logo} alt="Logo" className="inline h-6 w-6 mr-2" />
				<Link to="/dashboard" className="[&.active]:font-bold">
					Dashboard
				</Link>{" "}
				<Link to="/about" className="[&.active]:font-bold">
					About
				</Link>
				<div className="flex-grow" />
				{loggedIn && (
					<span className="italic">
						Logged in as {user?.username}
					</span>
				)}
				{loggedIn && (
					<button
						onClick={handleLogout}
						className="text-red-600 hover:bg-red-100 px-2 rounded"
					>
						Logout
					</button>
				)}
			</div>
			<hr />
			<Outlet />
			<TanStackRouterDevtools />
		</div>
	);
}

export const Route = createRootRoute({ component: RootLayout });
