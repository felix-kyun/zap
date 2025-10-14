import type { VaultItem } from "@/types/vault";
import { iconMap } from "@utils/iconMap";

type VaultItemPreviewProps = {
	item: VaultItem;
};

export function VaultItemPreview({
	item: { name, type, createdAt },
}: VaultItemPreviewProps) {
	const Icon = iconMap[type];

	return (
		<div className="flex border-1 rounded-lg justify-between items-center p-4 font-medium cursor-pointer border-border hover:border-accent transition-all duration-300 ease-out bg-neutral-900">
			<span className="font-bold flex items-center gap-2">
				<Icon />
				{name}
			</span>
			<span className="text-sm text-neutral-500">
				Created at {new Date(createdAt).toLocaleDateString()}
			</span>
		</div>
	);
}
