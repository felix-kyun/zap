import { VaultNotFoundError } from "@/errors/VaultNotFound";
import { useStore } from "@stores/store";
import { useEffect } from "react";
import { useModal } from "@hooks/useModal";
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
			unlockModalState.open();
		}
	}, [vault.state, redirectOnLock, unlockModalState]);

	return [vault, unlockModal] as const;
}
