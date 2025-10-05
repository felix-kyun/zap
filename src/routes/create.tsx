import { createFileRoute, redirect } from "@tanstack/react-router";
import { LabeledInput } from "@components/LabeledInput";
import {
	createInitialVault,
	deriveKey,
	fetchVault,
	saveVault,
} from "@services/vault.service";
import { useStore } from "@stores/store";
import { useState } from "react";
import toast from "react-hot-toast";
import { checkAuthState } from "@services/auth.service";

export const Route = createFileRoute("/create")({
	component: RouteComponent,
	beforeLoad: async () => {
		const authenticated = await checkAuthState();

		if (!authenticated)
			throw redirect({
				to: "/login",
			});

		try {
			const fetchedVault = await fetchVault();

			if (fetchedVault) {
				toast.error("Vault already exists, redirecting to dashboard.");
				throw redirect({
					to: "/dashboard",
				});
			}
		} catch {
			return;
		}
	},
	loader: () => createInitialVault(),
});

function RouteComponent() {
	const navigate = Route.useNavigate();
	const newVault = Route.useLoaderData();
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const setKey = useStore((state) => state.setKey);
	const setVault = useStore((state) => state.setVault);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		toast.promise(
			async () => {
				const key = deriveKey(password, newVault.salt);
				setVault(newVault);
				setKey(key);
				saveVault(key, newVault);
				setLoading(false);
			},
			{
				loading: "Creating vault...",
				success: () => {
					navigate({
						to: "/dashboard",
						from: "/create",
					});
					return "Vault created!";
				},
				error: (err) => `Error: ${err.message}`,
			},
		);
	};

	return (
		<div>
			<h1>Create Vault</h1>
			<form onSubmit={handleSubmit}>
				<LabeledInput
					label="Set Master Password"
					type="password"
					id="master-password"
					name="master-password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
				/>
				<button type="submit" disabled={loading}>
					Create Vault
				</button>
			</form>
		</div>
	);
}
