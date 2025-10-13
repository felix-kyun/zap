import { VaultNotFoundError } from "@/errors/VaultNotFound";
import { useStore } from "@stores/store";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useModal } from "./useModal";
import { UnlockModal } from "@components/UnlockModal";

type UseVaultProps = {
	redirectOnLock?: boolean;
};

export function useVault({ redirectOnLock }: UseVaultProps = {}) {
	const vault = useStore((state) => state.vault);
	const [unlockModal, unlockModalState] = useModal(UnlockModal);

	if (!vault) {
		throw new VaultNotFoundError();
	}

	// ensure vault is unlocked
	useEffect(() => {
		if (vault?.state === "locked") {
			if (redirectOnLock) {
				toast.error("Vault is locked, redirecting to unlock.", {
					id: "vault-locked",
				});
				throw new VaultNotFoundError();
			} else {
				unlockModalState.open();
			}
		}
	}, [vault.state, redirectOnLock, unlockModalState]);

	return [vault, unlockModal] as const;
}
