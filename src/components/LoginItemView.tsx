import { EditButton } from "@components/EditButton";
import { FieldRow, SensetiveFieldRow } from "@components/FieldRow";
import { Modal } from "@components/Modal";
import { getFaviconUrl } from "@utils/extractHostname";

import type { LoginItem } from "@/types/vault";

type LoginItemViewProps = {
	item: LoginItem;
	open: boolean;
	close: () => void;
};

export function LoginItemView({ item, open, close }: LoginItemViewProps) {
	const { username, password, url, tags, name } = item;

	return (
		<Modal
			open={open}
			close={close}
			header={
				<div className="flex gap-4 justify-start items-center">
					<div className="aspect-square h-full max-h-12 rounded-lg bg-white p-1.5 shadow flex items-center justify-center">
						<img
							src={getFaviconUrl(url)}
							alt={"Favicon"}
							className="bg-white object-cover"
						/>
					</div>
					<div className="flex flex-col gap-1 justify-between">
						<span className="font-bold text-2xl">{name}</span>
					</div>
				</div>
			}
			options={<EditButton />}
		>
			<div className="flex flex-col gap-4">
				{tags.length > 0 && (
					<div className="flex flex-wrap gap-1">
						{tags.map(({ value }) => (
							<span
								className="rounded-xl bg-accent text-sm py-1 px-2 font-medium"
								key={value}
							>
								{value}
							</span>
						))}
					</div>
				)}
				<FieldRow label="URL" value={url} />
				<FieldRow label="Username" value={username} />
				<SensetiveFieldRow label="Password" value={password} />
			</div>
		</Modal>
	);
}
