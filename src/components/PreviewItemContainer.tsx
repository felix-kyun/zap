import type { ComponentProps, ReactNode } from "react";
import clsx from "clsx";
import * as motion from "motion/react-client";

type PreviewItemContainerProps = ComponentProps<typeof motion.div> & {
	index: number;
	icon: ReactNode;
	primaryText: string;
	secondaryText: string;
};

export function PreviewItemContainer({
	index,
	primaryText,
	secondaryText,
	onClick,
	icon,
	...rest
}: PreviewItemContainerProps) {
	return (
		<motion.div
			layout
			className={clsx([
				"flex justify-start items-center",
				"border-1 rounded-xl border-border",
				"transition-colors duration-300 ease-out hover:border-accent",
				"p-4 bg-surface max-w-md",
				"cursor-pointer gap-2",
			])}
			onClick={onClick}
			transition={{
				delay: index * 0.05,
				duration: 0.2,
				layout: {
					ease: "easeInOut",
				},
			}}
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 0.95 }}
			{...rest}
		>
			<div className="aspect-square h-full max-h-12 rounded-lg bg-white p-1.5 shadow flex items-center justify-center">
				{icon}
			</div>
			<div className="flex flex-col gap-1 justify-between">
				<span className="font-bold text-lg">{primaryText}</span>
				<span className="text-text-secondary font-light text-xs">
					{secondaryText}
				</span>
			</div>
		</motion.div>
	);
}
