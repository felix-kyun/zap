import clsx from "clsx";
import * as motion from "motion/react-client";
import { SlOptionsVertical } from "react-icons/sl";

export function EditButton() {
	return (
		<motion.span
			className={clsx([
				"text-neutral-600 hover:text-neutral-400 transition",
				"cursor-pointer text-xl",
			])}
			whileHover={{ scale: 1.15 }}
			whileTap={{ scale: 0.9 }}
			transition={{ duration: 0.075 }}
		>
			<SlOptionsVertical />
		</motion.span>
	);
}
