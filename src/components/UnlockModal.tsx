import { useCallback, useEffect, useRef, useState } from "react";
import { Modal } from "@components/Modal";
import { LabeledPasswordInput } from "@components/LabeledPasswordInput";
import toast from "react-hot-toast";
import { useStore } from "@stores/store";
import { useShallow } from "zustand/shallow";

type UnlockModalProps = {
	open: boolean;
	close: () => void;
};

export function UnlockModal({ open, close }: UnlockModalProps) {
	const [password, setPassword] = useState("");
	const inputRef = useRef<HTMLInputElement>(null);
	const { unlockVault, setKeyFromPassword, checkVaultPassword } = useStore(
		useShallow(
			({ unlockVault, setKeyFromPassword, checkVaultPassword }) => ({
				unlockVault,
				setKeyFromPassword,
				checkVaultPassword,
			}),
		),
	);

	const handleUnlock = useCallback(() => {
		if (!password) return;

		toast.promise(
			async () => {
				const isValid = await checkVaultPassword(password);

				if (!isValid) {
					setPassword("");
					throw new Error("Invalid password");
				}

				await setKeyFromPassword(password);
				await unlockVault();
				setPassword("");
				close();
			},
			{
				loading: "Unlocking vault...",
				success: "Vault unlocked!",
				error: (error) => {
					setPassword("");
					return `Error: ${error.message}`;
				},
			},
		);
	}, [password, checkVaultPassword, setKeyFromPassword, unlockVault, close]);

	useEffect(() => {
		if (open) inputRef.current?.focus();
	}, [open]);

	return (
		<Modal open={open} close={close} title="Unlock Vault">
			<LabeledPasswordInput
				label="Master Password"
				id="password"
				ref={inputRef}
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				placeholder="Enter your vault password"
				onKeyDown={(e) => {
					if (e.key === "Enter") {
						e.preventDefault();
						e.stopPropagation();
						handleUnlock();
					}
				}}
			/>
		</Modal>
	);
}
