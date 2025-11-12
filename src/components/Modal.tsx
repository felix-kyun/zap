import clsx from "clsx";
import { AnimatePresence } from "motion/react";
import * as motion from "motion/react-client";
import { type PropsWithChildren, useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

type ModalProps = PropsWithChildren<{
	open: boolean;
	close: () => void;
	title?: string;
	header?: React.ReactNode;
	options?: React.ReactNode;
	containerClassName?: string;
	titleClassName?: string;
	layoutId?: string;
	disableClose?: boolean;
}>;

export function Modal({
	children,
	open,
	close: closeFunction,
	title,
	header,
	options,
	layoutId,
	disableClose = false,
	containerClassName,
	titleClassName,
}: ModalProps) {
	const container = useRef<HTMLDivElement>(null);

	if (!container.current) {
		const div = document.createElement("div");
		container.current = div;
	}

	// append root to body on mount
	useEffect(() => {
		document.body.appendChild(container.current!);

		return () => {
			if (container.current?.parentNode) {
				container.current.parentNode.removeChild(container.current);
			}
		};
	}, []);

	// scroll lock
	useEffect(() => {
		if (open) {
			const p = document.body.style.overflow;
			document.body.style.overflow = "hidden";

			return () => {
				document.body.style.overflow = p;
			};
		}
	}, [open]);

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

	if (!container.current) return null;

	return createPortal(
		<AnimatePresence mode="wait">
			{open && (
				<motion.div
					className="fixed z-50 inset-0 flex justify-center items-center bg-neutral-950/50 backdrop-blur"
					onClick={close}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.15 }}
				>
					<motion.div
						key="modal-container"
						className="z-10 container min-h-screen flex flex-col mx-auto justify-center items-center p-8"
					>
						<motion.div
							initial={{ opacity: 0, scale: 0.95, y: -8 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.95, y: -8 }}
							transition={{
								duration: 0.15,
							}}
							className={clsx([
								"flex flex-col w-full max-w-xl gap-6",
								"p-10",
								"rounded-xl shadow-lg",
								"sm:border-[1px] border-border bg-bg",
								containerClassName,
							])}
							layoutId={layoutId}
							onClick={(e) => e.stopPropagation()}
						>
							<div className="flex justify-between items-center text-3xl font-bold w-full">
								{header ? (
									header
								) : (
									<span className={`${titleClassName}`}>
										{title}
									</span>
								)}
								<div className="flex items-center gap-4 justify-between">
									{options}
								</div>
							</div>
							{children}
						</motion.div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>,
		container.current,
	);
}
