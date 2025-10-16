import { TagArray } from "@components/TagArray";
import { useRef, useState, useEffect } from "react";
import { Modal } from "@components/Modal";
import { LabeledInput } from "@components/LabeledInput";
import { useFieldArray, useFormContext } from "react-hook-form";
import type { VaultItem } from "@/types/vault";

export function TagsField() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const { getValues, control } = useFormContext<VaultItem>();
	const { update, fields, append } = useFieldArray<VaultItem>({
		control,
		name: "tags",
	});
	const type = getValues().type;

	useEffect(() => {
		if (fields.length === 0) {
			append({ value: type });
		}
	}, [fields, type, append]);

	useEffect(() => {
		if (type !== fields[0]?.value) update(0, { value: type });
	}, [type, update, fields]);

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
	const inputRef = useRef<HTMLInputElement>(null);
	const [tag, setTag] = useState("");
	const { control } = useFormContext<VaultItem>();
	const { append } = useFieldArray<VaultItem>({
		control,
		name: "tags",
	});

	useEffect(() => {
		if (open) inputRef.current?.focus();
	}, [open]);

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
					ref={inputRef}
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
