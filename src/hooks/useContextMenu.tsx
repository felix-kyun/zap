import { useCallback, useMemo, useState } from "react";

type Position = { x: number; y: number };

export function useContextMenu() {
	const [open, setOpen] = useState<boolean>(false);
	const [position, setPosition] = useState<Position>({ x: 0, y: 0 });

	const openMenu = useCallback((pos: Position) => {
		setPosition(pos);
		setOpen(true);
	}, []);

	const close = useCallback(() => {
		setOpen(false);
	}, []);

	const onContextMenu = useCallback(
		(e: React.MouseEvent) => {
			e.preventDefault();
			openMenu({ x: e.pageX, y: e.pageY });
		},
		[openMenu],
	);

	const bind = useMemo(
		() => ({
			onContextMenu,
		}),
		[onContextMenu],
	);

	const menuOptions = useMemo(
		() => ({
			open,
			position,
			close,
		}),
		[open, position, close],
	);

	return { bind, menuOptions };
}
