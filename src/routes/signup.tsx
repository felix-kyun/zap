import { createFileRoute, redirect } from "@tanstack/react-router";
import { checkAuthState, signup } from "@services/auth.service";
import { useState } from "react";
import { LabeledInput } from "@components/LabeledInput";
import toast from "react-hot-toast";

export const Route = createFileRoute("/signup")({
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

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [email, setEmail] = useState("");

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();

		toast.promise(signup({ username, email, password }), {
			loading: "Signing up...",
			success: () => {
				navigate({
					to: "/login",
					replace: true,
				});
				return "Signup successful! Please log in.";
			},
			error: (err) => {
				setPassword("");
				setUsername("");
				setEmail("");
				return `Signup failed: ${err.message}`;
			},
		});
	};

	return (
		<div className="signup">
			<h1>Signup Page</h1>
			<form onSubmit={handleSubmit}>
				<LabeledInput
					label="Username"
					type="text"
					id="username"
					name="username"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					required
				/>
				<LabeledInput
					label="Email"
					type="email"
					id="email"
					name="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
				/>
				<LabeledInput
					label="Password"
					type="password"
					id="password"
					name="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
				/>
				<button type="submit" disabled={status === "loading"}>
					Signup
				</button>
			</form>
		</div>
	);
}
