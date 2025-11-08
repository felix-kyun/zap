import { useMemo, type ComponentProps, type ReactNode } from "react";
import * as motion from "motion/react-client";
import { useContextMenu } from "@hooks/useContextMenu";
import { ContextMenu, type ContextMenuItem } from "./ContextMenu";
import { MdEdit } from "react-icons/md";
import clsx from "clsx";
import type { VaultItem } from "@/types/vault";
import toast from "react-hot-toast";

type PreviewItemContainerProps = ComponentProps<typeof motion.div> & {
	index: number;
	icon: ReactNode;
	// override onClick to provide item context
	menuItems?: Array<
		Omit<ContextMenuItem, "onClick"> & {
			onClick: (item: VaultItem) => void;
		}
	>;
	item: VaultItem;
	disabled?: boolean;
	primaryText: string;
	secondaryText: string;
};

export function PreviewItemContainer({
	index,
	primaryText,
	secondaryText,
	onClick,
	icon,
	className,
	disabled,
	menuItems,
	item,
	...rest
}: PreviewItemContainerProps) {
	const { bind, menuOptions } = useContextMenu();

	const defaultMenuItems: Array<ContextMenuItem> = useMemo(
		() => [
			{
				key: "edit",
				label: "Edit",
				icon: <MdEdit />,
				onClick: () =>
					toast.loading("Editing item...", {
						duration: 1000,
					}),
			},
			...(menuItems
				? menuItems.map((it) => ({
						...it,
						onClick: () => it.onClick(item),
					}))
				: []),
		],
		[item, menuItems],
	);

	return (
		<motion.div
			layout
			className={clsx([
				"flex justify-start items-center",
				"border-1 rounded-xl border-border",
				"transition-colors duration-300 ease-out hover:border-accent",
				"p-4 bg-surface",
				"cursor-pointer gap-2",
				className,
			])}
			onClick={onClick}
			transition={{
				delay: index * 0.05,
				duration: 0.2,
				layout: {
					ease: "easeInOut",
				},
			}}
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 0.95 }}
			{...rest}
			{...bind}
		>
			<div className="aspect-square h-full max-h-12 rounded-lg bg-white p-1.5 shadow flex items-center justify-center">
				{icon}
			</div>
			<div className="flex flex-col gap-1 justify-between">
				<span className="font-bold text-lg">{primaryText}</span>
				<span className="text-text-secondary font-light text-xs">
					{secondaryText}
				</span>
			</div>
			<ContextMenu {...menuOptions} items={defaultMenuItems} />
		</motion.div>
	);
}
