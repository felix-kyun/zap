import { CardItemView } from "@components/CardItemView";
import { LoginItemView } from "@components/LoginItemView";
import { NoteItemView } from "@components/NoteItemView";

import type { VaultItem } from "@/types/vault";

export type ItemViewModalProps = {
	item: VaultItem | null;
	open: boolean;
	close: () => void;
};

export function ItemViewModal({ item, open, close }: ItemViewModalProps) {
	if (!item) return <></>;

	switch (item.type) {
		case "login":
			return <LoginItemView item={item} open={open} close={close} />;
		case "card":
			return <CardItemView item={item} open={open} close={close} />;
		case "note":
			return <NoteItemView item={item} open={open} close={close} />;
		default:
			return <div>Unsupported item type: {item.type}</div>;
	}
}
