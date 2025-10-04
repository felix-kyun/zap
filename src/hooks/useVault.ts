import { fetchVault } from "@services/vault.service";
import { useStore } from "@stores/store";
import { useLocation, useNavigate } from "react-router-dom";
import { createResource } from "@utils/createResource";
import { useEffect } from "react";

export function useVault() {
	const navigate = useNavigate();
	const location = useLocation();

	const vaultResource = createResource("vault", fetchVault).read();

	const setVault = useStore((state) => state.setVault);

	useEffect(() => {
		const vault = useStore.getState().vault;
		if (vault && vault.state === "locked")
			navigate(`/unlock?from=${encodeURIComponent(location.pathname)}`);
	}, [navigate, location]);

	useEffect(() => {
		if (vaultResource && useStore.getState().vault === null)
			setVault(vaultResource);
	}, [vaultResource, setVault]);

	return vaultResource;
}
