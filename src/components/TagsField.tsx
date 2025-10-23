import { TagArray } from "@components/TagArray";
import { useState } from "react";
import { Modal } from "@components/Modal";
import { LabeledInput } from "@components/LabeledInput";
import { useFieldArray, useFormContext } from "react-hook-form";
import type { VaultItem } from "@/types/vault";

export function TagsField() {
	const [isModalOpen, setIsModalOpen] = useState(false);

	return (
		<>
			<NewTagModal
				open={isModalOpen}
				close={() => setIsModalOpen(false)}
			/>
			<TagArray onCreate={() => setIsModalOpen(true)} />
		</>
	);
}

type NewTagModalProps = {
	open: boolean;
	close: () => void;
};

function NewTagModal({ open, close }: NewTagModalProps) {
	const [tag, setTag] = useState("");
	const { control } = useFormContext<VaultItem>();
	const { append } = useFieldArray<VaultItem>({
		control,
		name: "tags",
	});

	const createNewTag = () => {
		if (tag.trim() === "") return;
		append({ value: tag.trim() });
		setTag("");
	};

	return (
		<Modal open={open} close={close} title="New Tag">
			<TagArray disableCreate className="mb-4" />
			<div className="w-full flex gap-4 items-center">
				<LabeledInput
					id="new-tag"
					label=""
					placeholder="Tag name"
					value={tag}
					autoFocus
					onChange={(e) => setTag(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							e.preventDefault();
							createNewTag();
						} else if (e.key === "Escape") {
							e.stopPropagation();
							close();
						}
					}}
				/>
			</div>
		</Modal>
	);
}
