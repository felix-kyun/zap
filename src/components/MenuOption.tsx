import clsx from "clsx";
import type { PropsWithChildren } from "react";

type MenuOptionProps = PropsWithChildren<{
	onClick?: () => void;
	disabled?: boolean;
	active?: boolean;
}>;

export function MenuOption({ children, onClick, active }: MenuOptionProps) {
	return (
		<div
			onClick={onClick}
			className={clsx([
				"flex items-center gap-2 rounded-xl px-3 py-3 cursor-pointer",
				active ? "hover:bg-accent/80" : "hover:bg-neutral-800",
				active ? "bg-accent" : "bg-transparent",
				"transition-all duration-300 ease-out",
			])}
		>
			{children}
		</div>
	);
}
