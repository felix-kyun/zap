import { useContextMenu } from "@hooks/useContextMenu";
import { useStore } from "@stores/store";
import clsx from "clsx";
import * as motion from "motion/react-client";
import { type ComponentProps, type ReactNode, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { MdDelete, MdEdit } from "react-icons/md";

import type { VaultItem } from "@/types/vault";

import { ContextMenu, type ContextMenuItem } from "./ContextMenu";
import { NewItemModal } from "./NewItemModal";

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
	menuItems,
	item,
	...rest
}: PreviewItemContainerProps) {
	const { bind, menuOptions } = useContextMenu();
	const [editorState, setEditorState] = useState(false);
	const deleteItem = useStore((state) => state.deleteItem);

	const defaultMenuItems: Array<ContextMenuItem> = useMemo(
		() => [
			{
				key: "edit",
				label: "Edit",
				icon: <MdEdit />,
				onClick: () => setEditorState(true),
			},
			{
				key: "delete",
				label: "Delete",
				icon: <MdDelete />,
				onClick: () =>
					toast.promise(deleteItem(item.id), {
						loading: "Deleting item...",
						success: "Item deleted",
						error: "Failed to delete item",
					}),
			},
			...(menuItems
				? menuItems.map((it) => ({
						...it,
						onClick: () => it.onClick(item),
					}))
				: []),
		],
		[item, menuItems, deleteItem],
	);

	return (
		<>
			<NewItemModal
				mode="edit"
				open={editorState}
				close={() => setEditorState(false)}
				item={item}
			/>
			<motion.div
				layout
				className={clsx([
					"flex justify-start items-center",
					"border-1 rounded-xl border-border",
					"transition-colors duration-300 ease-out hover:border-accent",
					"p-4 bg-surface max-w-md",
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
		</>
	);
}
