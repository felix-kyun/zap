import { AnimatePresence } from "motion/react";
import * as motion from "motion/react-client";
import type { ComponentProps } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { FaPlus } from "react-icons/fa";

import type { VaultItem } from "@/types/vault";

type TagArrayProps =
	| {
			onCreate: () => void;
			disableCreate?: never;
			className?: string;
	  }
	| {
			onCreate?: never;
			disableCreate: true;
			className?: string;
	  };

export function TagArray(props: TagArrayProps) {
	const { getValues } = useFormContext<VaultItem>();
	const { control } = useFormContext<VaultItem>();
	const { remove } = useFieldArray<VaultItem>({
		control,
		name: "tags",
	});

	return (
		<div className={`flex flex-wrap gap-1.5 ${props.className}`}>
			{getValues().tags.map(({ value }, index) => (
				<TagPill
					key={value}
					value={value}
					onClick={() => !(index === 0) && remove(index)}
				/>
			))}
			{props.onCreate && (
				<TagPill
					onClick={props.onCreate}
					tabIndex={0}
					value={<FaPlus />}
				/>
			)}
		</div>
	);
}

type TagPillProps = ComponentProps<typeof motion.span> & {
	value: string | React.ReactNode;
};

export function TagPill({ value, ...rest }: TagPillProps) {
	return (
		<AnimatePresence mode="wait">
			<motion.span
				className="inline-flex items-center rounded-full bg-accent py-0.5 px-2 font-semibold text-sm cursor-pointer"
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.95 }}
				initial={{ opacity: 0, scale: 0.8 }}
				animate={{ opacity: 1, scale: 1 }}
				exit={{ opacity: 0, scale: 0.8 }}
				transition={{ duration: 0.25 }}
				role="button"
				{...rest}
			>
				{value}
			</motion.span>
		</AnimatePresence>
	);
}
