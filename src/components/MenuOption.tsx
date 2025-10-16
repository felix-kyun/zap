import type { PropsWithChildren } from "react";

type MenuOptionProps = PropsWithChildren<{
	onClick?: () => void;
	disabled?: boolean;
}>;

export function MenuOption({ children, onClick }: MenuOptionProps) {
	return (
		<div
			onClick={onClick}
			className="flex items-center gap-2 rounded-xl px-3 py-3 cursor-pointer hover:bg-neutral-800 transition-all duration-300 ease-out"
		>
			{children}
		</div>
	);
}
