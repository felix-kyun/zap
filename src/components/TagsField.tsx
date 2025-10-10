import type { VaultItem } from "@/types/vault";
import { useEffect, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { LabeledInput } from "./LabeledInput";
import { TagPill } from "./TagPill";
import { vaultTypeSchema } from "@/schemas/vault";

type TagsFieldProps = {
	type: VaultItem["type"];
};

export function TagsField({ type }: TagsFieldProps) {
	const { control } = useFormContext<VaultItem>();
	const { append, remove, fields, update } = useFieldArray({
		control,
		name: "tags",
	});
	const [tag, setTag] = useState("");

	// Add the initial tag
	useEffect(() => {
		if (fields.length === 0 && vaultTypeSchema.options.includes(type)) {
			append({ value: type });
		}
	}, [append, fields.length, type]);

	// keep the first tag synced with the type
	useEffect(() => {
		if (
			fields.length > 0 &&
			vaultTypeSchema.options.includes(type) &&
			type !== fields[0].value
		)
			update(0, { value: type });
	}, [type, fields, update, append]);

	return (
		<>
			<div className="flex flex-wrap gap-3 mb-3">
				{fields.map((value, index) => (
					<TagPill
						key={value.id}
						value={fields[index].value}
						onClick={() => fields.length > 1 && remove(index)}
					/>
				))}
			</div>
			<div>
				<LabeledInput
					label=""
					id="new-tag"
					value={tag}
					onChange={(e) => setTag(e.target.value)}
					onKeyDown={(e) => {
						if (
							(e.key === "Enter" || e.key === " ") &&
							tag.trim() !== ""
						) {
							e.preventDefault();
							append({ value: tag.trim() });
							setTag("");
						}

						if (
							e.key === "Backspace" &&
							tag === "" &&
							fields.length > 1
						) {
							e.preventDefault();
							remove(fields.length - 1);
						}
					}}
					placeholder="Add new tags"
				/>
			</div>
		</>
	);
}
