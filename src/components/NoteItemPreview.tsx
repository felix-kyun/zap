import type { NoteItem, VaultItem } from "@/types/vault";
import NoteIcon from "@/assets/sticky-notes.png";
import clsx from "clsx";
import * as motion from "motion/react-client";

type NoteItemPreviewProps = {
	item: VaultItem;
	index: number;
	onClick?: () => void;
};

export function NoteItemPreview({
	item,
	index,
	onClick,
}: NoteItemPreviewProps) {
	const { name, content } = item as NoteItem;
	return (
		<motion.div
			layout
			className={clsx([
				"flex justify-start items-center",
				"border-1 rounded-xl border-border",
				"transition-colors duration-300 ease-out hover:border-accent",
				"p-4 bg-surface",
				"cursor-pointer gap-2",
			])}
			layoutId={item.id}
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
		>
			<div className="aspect-square h-full max-h-12 rounded-lg bg-white p-1.5 shadow flex items-center justify-center">
				<img
					src={NoteIcon}
					alt={"Favicon"}
					className="bg-white object-cover"
				/>
			</div>
			<div className="flex flex-col gap-1 justify-between">
				<span className="font-bold text-lg">{name}</span>
				<span className="text-text-secondary font-light text-xs">
					{content.slice(0, 30) + (content.length > 30 ? "..." : "")}
				</span>
			</div>
		</motion.div>
	);
}
