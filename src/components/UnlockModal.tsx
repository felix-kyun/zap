import { useCallback, useEffect, useRef, useState } from "react";
import { Modal } from "@components/Modal";
import { LabeledPasswordInput } from "@components/LabeledPasswordInput";
import toast from "react-hot-toast";
import { useStore } from "@stores/store";
import { AppError } from "@/errors/AppError";

type UnlockModalProps = {
	open: boolean;
	close: () => void;
};

export function UnlockModal({ open, close }: UnlockModalProps) {
	const [password, setPassword] = useState("");
	const [disableClose, setDisableClose] = useState(true);
	const inputRef = useRef<HTMLInputElement>(null);
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

	useEffect(() => {
		if (open) inputRef.current?.focus();
	}, [open]);

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
