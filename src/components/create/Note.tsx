import clsx from "clsx";
import { useFormContext } from "react-hook-form";

import type { NoteItem } from "@/types/vault";

export function CreateNoteItem() {
	const {
		register,
		formState: { errors },
	} = useFormContext<NoteItem>();

	return (
		<>
			<textarea
				className={clsx([
					"border-[1px] border-neutral-600 rounded-xl",
					"p-2 mb-1 min-h-[150px] w-full resize-y",
					"bg-neutral-900 text-neutral-100",
					"focus:outline-none focus:ring-2 focus:ring-accent",
					"overflow-auto scrollbar-hide transition",
				])}
				placeholder="Enter your note here..."
				{...register("content")}
			/>
			{errors.content && (
				<p className="text-red-500 text-sm mt-1">
					{errors.content.message}
				</p>
			)}
		</>
	);
}
