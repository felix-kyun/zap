import clsx from "clsx";
import * as motion from "motion/react-client";
import type { ComponentProps } from "react";
import type { PropsWithChildren } from "react";

type AccentButtonProps = PropsWithChildren<
	ComponentProps<typeof motion.button> & {
		className?: string;
	}
>;

export function AccentButton({
	children,
	className,
	...rest
}: AccentButtonProps) {
	return (
		<motion.button
			whileHover={{ scale: 1.03 }}
			whileTap={{ scale: 0.97 }}
			type="submit"
			className={clsx([
				"bg-accent text-text p-2 rounded-xl w-full font-medium",
				className,
			])}
			{...rest}
		>
			{children}
		</motion.button>
	);
}
