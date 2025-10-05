import toast from "react-hot-toast";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { checkAuthState, login } from "@services/auth.service";
import { useStore } from "@stores/store";

export const Route = createFileRoute("/login")({
	component: RouteComponent,
	loader: async () => {
		const authenticated = await checkAuthState();
		if (authenticated) {
			toast("You're already logged in.");
			throw redirect({
				to: "/",
				replace: true,
			});
		}
	},
});

function RouteComponent() {
	const navigate = Route.useNavigate();
	const setUser = useStore((state) => state.setUser);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		toast.promise(login({ email, password }), {
			loading: "Logging in...",
			success: (data) => {
				setUser(data);
				navigate({
					to: "/",
					replace: true,
				});

				return "Login successful!";
			},
			error: () => {
				setPassword("");
				return "Login failed, please check your credentials and try again.";
			},
		});
	};

	return (
		<div className="login">
			<h1>Login Page</h1>
			<form onSubmit={handleSubmit}>
				<div>
					<label htmlFor="email">Email:</label>
					<input
						type="text"
						id="email"
						name="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</div>
				<div>
					<label htmlFor="password">Password:</label>
					<input
						type="password"
						id="password"
						name="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</div>
				<button type="submit" disabled={status === "loading"}>
					Login
				</button>
			</form>
		</div>
	);
}
