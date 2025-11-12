import clsx from "clsx";
import { AnimatePresence } from "motion/react";
import * as motion from "motion/react-client";
import {
	type ReactNode,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";

export type ContextMenuItem = {
	key: string;
	label: string;
	onClick: () => void;
	disabled?: boolean;
	icon?: ReactNode;
};

type ContextMenuProps = {
	open: boolean;
	position: { x: number; y: number };
	close: () => void;
	items: Array<ContextMenuItem>;
};

const offset = 0;

export function ContextMenu({
	open,
	position,
	close,
	items,
}: ContextMenuProps) {
	const menuRef = useRef<HTMLDivElement>(null);
	const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
	const [pos, setPos] = useState<{ x: number; y: number }>(() => ({
		x: position.x,
		y: position.y,
	}));

	// positioning
	useEffect(() => {
		if (!open || !menuRef.current) return;

		const rect = menuRef.current.getBoundingClientRect();

		let x = position.x;
		let y = position.y;

		// adjust
		if (x + rect.width > window.innerWidth) {
			x = position.x - rect.width - offset;
		} else {
			x = position.x + offset;
		}

		if (y + rect.height > window.innerHeight) {
			y = position.y - rect.height - offset;
		} else {
			y = position.y + offset;
		}

		setPos({ x, y });

		// focus first non-disabled item
		const idx = items.findIndex((item) => !item.disabled);
		if (idx >= 0) {
			itemRefs.current[idx]?.focus();
		}
	}, [open, position, items]);

	// close on outside click
	useEffect(() => {
		if (!open) return;

		const onClick = (e: MouseEvent) => {
			e.stopPropagation();
			if (menuRef.current && menuRef.current.contains(e.target as Node))
				return;
			close();
		};

		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") close();
		};

		window.addEventListener("keydown", onKeyDown);
		window.addEventListener("click", onClick);

		return () => {
			window.removeEventListener("keydown", onKeyDown);
			window.removeEventListener("click", onClick);
		};
	}, [open, close]);

	const handleItemKeyDown = useCallback(
		(
			e: React.KeyboardEvent<HTMLDivElement>,
			index: number,
			item: ContextMenuItem,
		) => {
			switch (e.key) {
				case "ArrowDown": {
					e.preventDefault();
					// focus next non-disabled item
					for (let i = index + 1; i < items.length; i++) {
						if (!items[i].disabled) {
							itemRefs.current[i]?.focus();
							break;
						}
					}
					break;
				}
				case "ArrowUp": {
					e.preventDefault();
					// focus previous non-disabled item
					for (let i = index - 1; i >= 0; i--) {
						if (!items[i].disabled) {
							itemRefs.current[i]?.focus();
							break;
						}
					}
					break;
				}
				case "Enter": {
					e.preventDefault();
					if (!item.disabled) {
						item.onClick();
						close();
					}
					break;
				}
			}
		},
		[close, items],
	);

	return (
		<AnimatePresence>
			{open && (
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					exit={{ opacity: 0, scale: 0.95 }}
					transition={{ duration: 0.15 }}
					className={clsx([
						"fixed z-50 w-32",
						"rounded-lg shadow-lg border-1",
						"border-border bg-surface",
						"overflow-hidden text-sm",
					])}
					role="menu"
					ref={menuRef}
					style={{ top: pos.y, left: pos.x }}
				>
					{items.map((item, index) => (
						<div
							key={item.key}
							role="menuitem"
							tabIndex={item.disabled ? -1 : 0}
							aria-disabled={item.disabled ? "true" : "false"}
							ref={(el) => {
								itemRefs.current[index] = el;
							}}
							className={clsx([
								"flex items-center gap-2 cursor-pointer",
								"outline-none focus:bg-border hover:bg-border",
								"p-2",
							])}
							onMouseOver={(e) => {
								if (item.disabled) return;
								e.currentTarget.focus();
							}}
							onClick={(e) => {
								e.stopPropagation();
								if (item.disabled) return;
								item.onClick();
								close();
							}}
							onKeyDown={(e) => handleItemKeyDown(e, index, item)}
						>
							{item.icon && <span> {item.icon} </span>}
							<span>{item.label}</span>
						</div>
					))}
				</motion.div>
			)}
		</AnimatePresence>
	);
}
