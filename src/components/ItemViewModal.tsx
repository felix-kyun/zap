import type { VaultItem } from "@/types/vault";
import { Modal } from "./Modal";
import { LoginItemView } from "./LoginItemView";
import { CardItemView } from "./CardItemView";
import { NoteItemView } from "./NoteItemView";

export type ItemViewModalProps = {
	item: VaultItem | null;
	open: boolean;
	close: () => void;
};

function renderItemView(item: VaultItem) {
	switch (item.type) {
		case "login":
			return <LoginItemView item={item} />;
		case "card":
			return <CardItemView item={item} />;
		case "note":
			return <NoteItemView item={item} />;
		default:
			return <div>Unsupported item type: {item.type}</div>;
	}
}

export function ItemViewModal({ item, open, close }: ItemViewModalProps) {
	if (!item) return <></>;

	return (
		<Modal open={open} close={close} title="">
			{renderItemView(item)}
		</Modal>
	);
}
