import type { ComponentProps } from "react";
import * as motion from "motion/react-client";

type AccentButtonProps = ComponentProps<typeof motion.button>;

export function AccentButton({ children, ...rest }: AccentButtonProps) {
	return (
		<motion.button
			whileHover={{ scale: 1.03 }}
			whileTap={{ scale: 0.97 }}
			type="submit"
			className="bg-accent text-text p-2 mt-4 rounded-xl w-full font-medium"
			{...rest}
		>
			{children}
		</motion.button>
	);
}
