import type { VaultItem } from "@/types/vault";
import { useState, type HTMLAttributes } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { LabeledInput } from "./LabeledInput";

export function TagsField() {
	const { control, watch } = useFormContext<VaultItem>();
	const { remove, append, fields } = useFieldArray({ control, name: "tags" });
	const [tag, setTag] = useState("");
	const tags = watch("tags");

	return (
		<div className="my-4">
			<div className="mb-2">
				Tags:
				{fields.map((value, index) => (
					<TagPill
						key={value.id}
						value={tags[index].value}
						onRemove={() => remove(index)}
					/>
				))}
			</div>
			<div>
				<LabeledInput
					label="New Tag"
					id="new-tag"
					value={tag}
					onChange={(e) => setTag(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter" && tag.trim() !== "") {
							e.preventDefault();
							append({ value: tag.trim() });
							setTag("");
						}
					}}
					placeholder="Add tag and press Enter"
				/>
			</div>
		</div>
	);
}

type TagPillProps = {
	value: string;
	onRemove: () => void;
};

function TagPill({
	value,
	...rest
}: TagPillProps & HTMLAttributes<HTMLSpanElement>) {
	return (
		<span
			className="border-1 rounded-3xl p-[0.3rem] text-xs mx-1 font-normal font-[Montserrat] hover:bg-black hover:text-white cursor-pointer inline-flex items-center transition duration-200"
			{...rest}
		>
			{value}
		</span>
	);
}
