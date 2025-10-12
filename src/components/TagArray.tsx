import type { ComponentProps } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import type { VaultItem } from "@/types/vault";
import { FaPlus } from "react-icons/fa";
import clsx from "clsx";
import * as motion from "motion/react-client";
import { AnimatePresence } from "motion/react";

type TagArrayProps =
	| {
			onCreate: () => void;
			disableCreate?: never;
			className?: string;
	  }
	| {
			onCreate?: never;
			disableCreate: boolean;
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
		<div className={`flex flex-wrap gap-3 ${props.className}`}>
			{getValues().tags.map(({ value }, index) => (
				<TagPill
					key={value}
					value={value}
					onClick={() => !(index === 0) && remove(index)}
				/>
			))}
			{props.onCreate && (
				<motion.span
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					exit={{ opacity: 0, scale: 0.8 }}
					transition={{ duration: 0.25 }}
					className={clsx([
						"bg-accent",
						"rounded-xl py-2 px-3",
						"text-xs transition-colors cursor-pointer",
						"focus:outline-none focus:ring-2 focus:ring-accent",
						"flex items-center justify-center",
					])}
					onClick={props.onCreate}
					tabIndex={0}
				>
					<FaPlus />
				</motion.span>
			)}
		</div>
	);
}

type TagPillProps = ComponentProps<typeof motion.span> & {
	value: string;
};

function TagPill({ value, ...rest }: TagPillProps) {
	return (
		<AnimatePresence mode="wait">
			<motion.span
				className="rounded-xl bg-accent py-1 px-3 font-medium text-sm cursor-pointer"
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
