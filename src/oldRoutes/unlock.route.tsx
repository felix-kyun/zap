import { LabeledInput } from "@components/LabeledInput";
import { useStore } from "@stores/store";
import { useEffect, useState } from "react";
import { useLoaderData, useLocation, useNavigate } from "react-router-dom";
import { useShallow } from "zustand/shallow";
import toast from "react-hot-toast";
import type { Vault } from "@/types/vault";

export function UnlockRoute() {
	const navigate = useNavigate();
	const location = useLocation();
	const fetchedVault = useLoaderData<Vault>();

	const [password, setPassword] = useState("");
	const { unlockVault, checkVaultPassword, setVault, vault } = useStore(
		useShallow(({ unlockVault, checkVaultPassword, setVault, vault }) => ({
			unlockVault,
			checkVaultPassword,
			setVault,
			vault,
		})),
	);

	// if theres no vault, set it from loaded
	useEffect(() => {
		if (!vault) setVault(fetchedVault);
	}, [vault, setVault, fetchedVault]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		try {
			if (checkVaultPassword(password)) {
				toast.promise(
					async () => {
						unlockVault(password);
						navigate(
							new URLSearchParams(location.search).get("from") ||
								"/",
							{
								replace: true,
							},
						);
					},
					{
						loading: "Unlocking vault...",
						success: "Vault unlocked!",
						error: (err) => `Error: ${err.message}`,
					},
				);
			} else {
				toast.error("Invalid master password, please try again.");
				setPassword("");
			}
		} catch (error) {
			if (error instanceof Error) toast.error(error.message);
			else toast.error("An unknown error occurred.");
			return;
		}
	};

	return (
		<div>
			<h1>Unlock Vault</h1>
			<form onSubmit={handleSubmit}>
				<LabeledInput
					label="Master Password"
					type="password"
					id="master-password"
					name="master-password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
				/>
			</form>
		</div>
	);
}
