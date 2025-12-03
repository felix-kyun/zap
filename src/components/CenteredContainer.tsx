import clsx from "clsx";
import * as motion from "motion/react-client";
import type { PropsWithChildren } from "react";

export function CenteredContainer({
	children,
	className,
}: PropsWithChildren<{ className?: string }>) {
	return (
		<motion.div
			className="container mx-auto min-h-screen flex items-center justify-center font-[Karla] px-4"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.15, delay: 0.1 }}
		>
			<motion.div
				initial={{ opacity: 0, scale: 0.95 }}
				animate={{ opacity: 1, scale: 1 }}
				exit={{ opacity: 0, scale: 0.95 }}
				transition={{ duration: 0.15, delay: 0.1 }}
				className={clsx([
					"flex flex-col w-full max-w-md py-8 px-12 shadow-lg",
					"border border-border bg-surface rounded-xl",
					className,
				])}
			>
				{children}
			</motion.div>
		</motion.div>
	);
}
