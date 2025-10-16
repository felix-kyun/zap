import { useEffect } from "react";

export function useInitial(callback: () => void) {
	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(callback, []);
}
