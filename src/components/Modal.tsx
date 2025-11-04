import { AnimatePresence } from "motion/react";
import * as motion from "motion/react-client";
import { RiCloseLargeFill } from "react-icons/ri";
import { type PropsWithChildren, useEffect, useCallback, useRef } from "react";
import clsx from "clsx";
import { createPortal } from "react-dom";

type ModalProps = PropsWithChildren<{
	open: boolean;
	close: () => void;
	title: string;
	disableClose?: boolean;
	containerClassName?: string;
	titleClassName?: string;
	closeButtonClassNames?: string;
	layoutId?: string;
}>;

export function Modal({
	children,
	open,
	close: closeFunction,
	title,
	layoutId,
	disableClose = false,
	containerClassName,
	titleClassName,
	closeButtonClassNames,
}: ModalProps) {
	const container = useRef<HTMLDivElement>(null);

	if (!container.current) {
		const div = document.createElement("div");
		container.current = div;
	}

	useEffect(() => {
		document.body.appendChild(container.current!);

		return () => {
			document.body.removeChild(container.current!);
		};
	}, []);

	const close = useCallback(() => {
		if (disableClose) return;
		closeFunction();
	}, [closeFunction, disableClose]);

	useEffect(() => {
		if (!open) return;

		const handleEvent = (e: KeyboardEvent) => {
			if (e.key === "Escape") close();
		};

		window.addEventListener("keydown", handleEvent);

		return () => window.removeEventListener("keydown", handleEvent);
	}, [open, close, disableClose]);

	if (!open) return null;

	return createPortal(
		<AnimatePresence>
			{open && (
				<motion.div
					className="fixed z-50 inset-0 flex justify-center items-center"
					onClick={close}
				>
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.15 }}
						className="absolute inset-0 bg-neutral-950/50 backdrop-blur"
					/>
					<motion.div className="z-10 container min-h-screen flex flex-col mx-auto justify-center items-center p-8">
						<motion.div
							initial={{ opacity: 0, scale: 0.95, y: -8 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.95, y: -8 }}
							transition={{
								duration: 0.15,
							}}
							className={clsx([
								"relative flex flex-col w-full max-w-xl",
								"px-12 pt-8 pb-12",
								"rounded-xl shawdow-lg",
								"sm:border-[1px] border-border bg-bg",
								containerClassName,
							])}
							layoutId={layoutId}
							onClick={(e) => e.stopPropagation()}
						>
							<span
								className={`text-3xl font-bold mb-4 ${titleClassName}`}
							>
								{title}
							</span>
							{disableClose || (
								<motion.span
									className={clsx([
										"text-neutral-600 hover:text-neutral-400 transition",
										"absolute top-8 right-8 cursor-pointer text-2xl",
										closeButtonClassNames,
									])}
									whileHover={{ scale: 1.15 }}
									whileTap={{ scale: 0.9 }}
									transition={{ duration: 0.075 }}
									onClick={close}
								>
									<RiCloseLargeFill />
								</motion.span>
							)}
							{children}
						</motion.div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>,
		container.current,
	);
}
