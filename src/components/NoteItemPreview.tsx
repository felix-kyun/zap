import type { NoteItem, VaultItem } from "@/types/vault";
import NoteIcon from "@/assets/sticky-notes.png";
import { PreviewItemContainer } from "@components/PreviewItemContainer";

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
		<PreviewItemContainer
			onClick={onClick}
			layoutId={item.id}
			index={index}
			icon={
				<img
					src={NoteIcon}
					alt={"Favicon"}
					className="bg-white object-cover"
				/>
			}
			primaryText={name}
			secondaryText={
				content.slice(0, 30) + (content.length > 30 ? "..." : "")
			}
		/>
	);
}
