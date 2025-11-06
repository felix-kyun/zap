import type { NoteItem } from "@/types/vault";
import NoteIcon from "@/assets/sticky-notes.png";
import { Modal } from "@components/Modal";
import { EditButton } from "@components/EditButton";

type NoteItemViewProps = {
	item: NoteItem;
	open: boolean;
	close: () => void;
};

export function NoteItemView({ item, open, close }: NoteItemViewProps) {
	const { name, content } = item as NoteItem;
	return (
		<Modal
			open={open}
			close={close}
			title="Note Details"
			header={
				<div className="flex gap-4 justify-start items-center">
					<div className="aspect-square h-full max-h-12 rounded-lg bg-white p-1.5 shadow flex items-center justify-center">
						<img
							src={NoteIcon}
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
				<div className="whitespace-pre-wrap text-text-secondary overflow-y-auto max-h-96 scrollbar-hide">
					{content}
				</div>
			</div>
		</Modal>
	);
}
