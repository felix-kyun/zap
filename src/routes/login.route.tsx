import { useEffect, useState } from "react";
import { login } from "@services/auth.service";
import { useAsync } from "@hooks/useAsync";
import { useLocation, useNavigate } from "react-router-dom";
import { loginSchema } from "@/schemas/login";
import { useStore } from "@stores/store";

export function Login() {
	const location = useLocation();
	const navigate = useNavigate();
	const setUser = useStore((state) => state.setUser);
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const { error, status, data, run } = useAsync(login);

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		run(username, password);
	};

	useEffect(() => {
		if (status === "success") {
			const user = data;
			loginSchema.parse(user);
			setUser({ ...user, loggedIn: true });
			navigate("/", { replace: true });
		}
	}, [location.search, navigate, status, setUser, data]);

	if (error) {
		throw error;
	}

	return (
		<div className="login">
			<h1>Login Page</h1>
			<form onSubmit={handleSubmit}>
				<div>
					<label htmlFor="username">Username:</label>
					<input
						type="text"
						id="username"
						name="username"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
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
