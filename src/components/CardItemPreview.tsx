import { PreviewItemContainer } from "@components/PreviewItemContainer";

import type { CardItem, VaultItem } from "@/types/vault";

type CardItemPreviewProps = {
	item: VaultItem;
	index: number;
	onClick?: () => void;
};

export function CardItemPreview({
	item,
	index,
	onClick,
}: CardItemPreviewProps) {
	const { cardNumber, cardHolder } = item as CardItem;
	return (
		<PreviewItemContainer
			item={item}
			onClick={onClick}
			layoutId={item.id}
			index={index}
			icon={<span className="text-2xl">💳</span>}
			primaryText={item.name}
			secondaryText={`${cardHolder} - ${cardNumber.slice(-4)}`}
		/>
	);
}
