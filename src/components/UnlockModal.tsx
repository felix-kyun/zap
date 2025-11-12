import { LabeledPasswordInput } from "@components/LabeledPasswordInput";
import { Modal } from "@components/Modal";
import { useStore } from "@stores/store";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";

import { AppError } from "@/errors/AppError";

type UnlockModalProps = {
	open: boolean;
	close: () => void;
};

export function UnlockModal({ open, close }: UnlockModalProps) {
	const [password, setPassword] = useState("");
	const [disableClose, setDisableClose] = useState(true);
	const unlockVault = useStore((state) => state.unlockVault);

	const handleUnlock = useCallback(() => {
		if (!password) return;

		toast.promise(unlockVault(password), {
			loading: "Unlocking vault...",
			success: () => {
				setDisableClose(false);
				setPassword("");
				close();
				return "Vault unlocked!";
			},
			error: (error) => {
				setPassword("");
				if (error instanceof AppError) {
					return error.message;
				}
				return `Error: ${error.message}`;
			},
		});
	}, [password, unlockVault, close]);

	return (
		<Modal
			open={open}
			close={close}
			disableClose={disableClose}
			title="Unlock Vault"
		>
			<LabeledPasswordInput
				label="Master Password"
				id="password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				placeholder="Enter your vault password"
				autoFocus
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
