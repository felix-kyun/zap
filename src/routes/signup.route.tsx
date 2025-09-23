import { useNavigate } from "react-router-dom";
import { signup } from "../services/auth.service";
import { useAsync } from "../hooks/useAsync";
import { useEffect, useState } from "react";
import { LabeledInput } from "../components/LabeledInput";

export function Signup() {
	const navigate = useNavigate();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [email, setEmail] = useState("");
	const [name, setName] = useState("");
	const { error, status, run } = useAsync(signup);

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		run({ username, password, email, name });
	};

	useEffect(() => {
		if (status === "success") {
			navigate("/login", { replace: true });
		}
	}, [status, navigate]);

	if (error) throw error;

	return (
		<div className="signup">
			<h1>Signup Page</h1>
			<form onSubmit={handleSubmit}>
				<LabeledInput
					label="Name"
					type="text"
					id="name"
					name="name"
					value={name}
					onChange={(e) => setName(e.target.value)}
					required
				/>
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
