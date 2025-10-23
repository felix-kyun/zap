import type { LoginItem, VaultItem } from "@/types/vault";
import { getFaviconUrl } from "@utils/extractHostname";
import clsx from "clsx";
import * as motion from "motion/react-client";

type LoginItemPreviewProps = {
	item: VaultItem;
	index: number;
	onClick?: () => void;
};

export function LoginItemPreview({
	item,
	index,
	onClick,
}: LoginItemPreviewProps) {
	const { username, url, name } = item as LoginItem;
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
			onClick={onClick}
			layoutId={item.id}
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
					src={getFaviconUrl(url)}
					alt={"Favicon"}
					className="bg-white object-cover"
				/>
			</div>
			<div className="flex flex-col gap-1 justify-between">
				<span className="font-bold text-lg">{name}</span>
				<span className="text-text-secondary font-light text-xs">
					{username}
				</span>
			</div>
		</motion.div>
	);
}
