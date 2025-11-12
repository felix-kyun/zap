import clsx from "clsx";

import type { VaultItem } from "@/types/vault";

type VaultItemPreviewProps = {
	item: VaultItem;
};

export function VaultItemPreview({
	item: { name, tags, createdAt },
}: VaultItemPreviewProps) {
	return (
		<div
			className={clsx([
				"grid grid-cols-3 grid-rows-1 items-center",
				"border-1 rounded-xl border-border",
				"transition-all duration-300 ease-out hover:border-accent",
				"p-4 bg-surface h-32",
				"cursor-pointer",
			])}
		>
			<span className="font-bold flex items-center gap-2">{name}</span>
			<span className="flex items-center gap-2 justify-center">
				{tags.map(({ value }) => (
					<span className="rounded-xl bg-neutral-800 py-1 px-3 font-medium text-sm">
						{value}
					</span>
				))}
			</span>
			<span className="text-sm text-neutral-500 flex justify-end">
				Created at {new Date(createdAt).toLocaleDateString()}
			</span>
		</div>
	);
}
