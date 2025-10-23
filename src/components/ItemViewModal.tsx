import type { LoginItem, VaultItem } from "@/types/vault";
import { Modal } from "./Modal";
import { getFaviconUrl } from "@utils/extractHostname";
import { LoginItemView } from "./LoginItemView";

export type ItemViewModalProps = {
	item: VaultItem | null;
	open: boolean;
	close: () => void;
};

function renderItemView(item: VaultItem) {
	switch (item.type) {
		case "login":
			return <LoginItemView item={item} />;
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
