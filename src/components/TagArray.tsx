import { AnimatePresence } from "motion/react";
import * as motion from "motion/react-client";
import type { ComponentProps } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { FaPlus } from "react-icons/fa";

import type { VaultItem } from "@/types/vault";
import clsx from "clsx";

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

export function TagArray({ onCreate, className }: TagArrayProps) {
	const { getValues } = useFormContext<VaultItem>();
	const { control } = useFormContext<VaultItem>();
	const { remove } = useFieldArray<VaultItem>({
		control,
		name: "tags",
	});

	if (getValues().tags.length === 0 && !onCreate) return null;

	return (
		<div className={`flex flex-wrap gap-1.5 ${className}`}>
			{getValues().tags.map(({ value }, index) => (
				<TagPill
					key={value}
					value={value}
					onClick={() => remove(index)}
					className={"text-bg font-semibold"}
				/>
			))}
			{onCreate && (
				<TagPill
					onClick={onCreate}
					tabIndex={0}
					value={<FaPlus />}
					className="bg-bg text-accent"
				/>
			)}
		</div>
	);
}

type TagPillProps = ComponentProps<typeof motion.span> & {
	value: string | React.ReactNode;
};

export function TagPill({ value, className, ...rest }: TagPillProps) {
	return (
		<AnimatePresence mode="wait">
			<motion.span
				className={clsx([
					"inline-flex items-center rounded-full justify-center",
					"bg-accent py-0.5 px-2 text-sm cursor-pointer",
					className,
				])}
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
