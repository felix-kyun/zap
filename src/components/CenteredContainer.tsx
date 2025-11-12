import { AnimatePresence } from "motion/react";
import * as motion from "motion/react-client";
import type { PropsWithChildren } from "react";

export function CenteredContainer({ children }: PropsWithChildren) {
	return (
		<AnimatePresence mode="wait">
			<motion.div
				className="container mx-auto min-h-screen flex items-center justify-center text-xl font-[Karla] px-4"
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
					className="flex flex-col gap-8 w-full max-w-lg pb-10 pt-6 px-8 md:px-12 rounded-2xl border-1 border-border bg-surface"
				>
					{children}
				</motion.div>
			</motion.div>
		</AnimatePresence>
	);
}
