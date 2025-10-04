import { LabeledInput } from "@components/LabeledInput";
import { useAsync } from "@hooks/useAsync";
import {
	createInitialVault,
	deriveKey,
	saveVault,
} from "@services/vault.service";
import { useStore } from "@stores/store";
import { useState } from "react";

export function CreateVaultRoute() {
	const [password, setPassword] = useState("");
	const setKey = useStore((state) => state.setKey);
	const setVault = useStore((state) => state.setVault);
	const { run, status } = useAsync(saveVault);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const newVault = createInitialVault();
		setVault(newVault);

		const key = deriveKey(password, newVault.salt);
		setKey(key);

		run(key, newVault);
	};

	return (
		<div>
			<h1>Unlock Vault</h1>
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
				<button type="submit">Create Vault</button>
			</form>
		</div>
	);
}
