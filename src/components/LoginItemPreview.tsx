import type { LoginItem, VaultItem } from "@/types/vault";
import { getFaviconUrl } from "@utils/extractHostname";
import { PreviewItemContainer } from "@components/PreviewItemContainer";

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
		<PreviewItemContainer
			onClick={onClick}
			layoutId={item.id}
			index={index}
			icon={
				<img
					src={getFaviconUrl(url)}
					alt={"Favicon"}
					className="bg-white object-cover"
				/>
			}
			primaryText={name}
			secondaryText={username}
		/>
	);
}
