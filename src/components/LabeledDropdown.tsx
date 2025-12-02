import clsx from "clsx";
import { AnimatePresence } from "motion/react";
import * as motion from "motion/react-client";
import {
	type FocusEvent,
	type KeyboardEvent,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import { LuChevronsUpDown } from "react-icons/lu";
import { TiTick } from "react-icons/ti";

type LabeledDropdownProps<T extends string> = {
	label: string;
	value: T;
	options: T[];
	onChange: (value: T) => void;
	onBlur?: (e: FocusEvent<unknown>) => void;
};

function focusWithin(
	container: HTMLElement | null,
	relatedTarget: EventTarget | null,
) {
	if (!container || !relatedTarget) return false;
	return container.contains(relatedTarget as Node);
}

export function LabeledDropdown<T extends string>({
	label,
	value,
	options,
	onChange,
	onBlur,
}: LabeledDropdownProps<T>) {
	const [open, setOpen] = useState<boolean>(false);
	const optionContainerRef = useRef<HTMLDivElement>(null);
	const buttonRef = useRef<HTMLButtonElement>(null);
	const optionsRef = useRef<(HTMLDivElement | null)[]>([]);

	const handleBlur = useCallback(
		(e: FocusEvent) => {
			// only fire onBlur if none of the childrens are focused
			if (focusWithin(optionContainerRef.current, e.relatedTarget)) {
				return;
			}
			setOpen(false);
			if (onBlur) onBlur(e);
		},
		[onBlur],
	);

	const selectPrevious = useCallback(
		(index: number) => {
			const prev = (index - 1) % options.length;
			optionsRef.current[prev]?.focus();
		},
		[options.length],
	);

	const selectNext = useCallback(
		(index: number) => {
			const prev = (index + 1) % options.length;
			optionsRef.current[prev]?.focus();
		},
		[options.length],
	);

	const handleKeyDown = useCallback(
		(e: KeyboardEvent<HTMLDivElement>, option: T, index: number) => {
			if (
				[
					"Enter",
					" ",
					"Tab",
					"ArrowDown",
					"ArrowUp",
					"Escape",
				].includes(e.key)
			) {
				e.preventDefault();
				if (e.key === "Enter" || e.key === " ") {
					onChange(option);
					setOpen(false);
				} else if (e.key === "ArrowDown") selectNext(index);
				else if (e.key === "ArrowUp") selectPrevious(index);
				else if (e.key === "Escape") {
					setOpen(false);
					buttonRef.current?.focus();
				} else if (e.key === "Tab") {
					if (e.shiftKey) selectPrevious(index);
					else selectNext(index);
				}
			}
		},
		[onChange, selectNext, selectPrevious],
	);

	// cleanup refs to avoid memory leaks
	useEffect(() => {
		optionsRef.current = options.map(() => null);
	}, [options]);

	useEffect(() => {
		// place on the current selected one
		if (open && value) {
			const index = options.indexOf(value);

			if (index >= 0 && optionsRef.current[index]) {
				optionsRef.current[index].scrollIntoView({ block: "nearest" });
				optionsRef.current[index].focus();
			}
		}
	}, [open, value, options]);

	return (
		<div className={`flex flex-col flex-2 px-2 gap-2`}>
			{label !== "" && (
				<label htmlFor="type" className={`text-sm font-bold`}>
					{label}
				</label>
			)}
			<div
				className="relative w-full"
				onBlur={handleBlur}
				ref={optionContainerRef}
			>
				<button
					type="button"
					ref={buttonRef}
					className={clsx([
						"border-neutral-600 bg-neutral-900",
						focusWithin(
							optionContainerRef.current,
							document.activeElement,
						)
							? "ring-2 ring-accent"
							: null,
						"focus:outline-none focus:ring-2 focus:ring-accent",
						"border-[1px] w-full rounded-xl p-2",
						"transition duration-200 block appearance-none",
						"font-medium text-left",
					])}
					onClick={() => setOpen((state) => !state)}
				>
					{value ?? "Select"}
				</button>
				<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-neutral-600">
					<LuChevronsUpDown />
				</div>
				<AnimatePresence>
					{open && (
						<motion.div
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.95 }}
							transition={{ duration: 0.15 }}
							className={clsx([
								"absolute z-10 mt-2 p-1 w-full max-h-60",
								"bg-neutral-900 border-1 border-neutral-600",
								"rounded-xl shadow-lg",
								"overflow-y-auto",
							])}
						>
							{options.map((option, index) => (
								<div
									key={option}
									className={clsx([
										"m-1 p-2 pl-2 hover:bg-neutral-800 cursor-pointer",
										"focus:bg-neutral-800 outline-none",
										"rounded-xl overflow-hidden",
										"flex justify-between",
									])}
									ref={(el) => {
										if (el) optionsRef.current[index] = el;
									}}
									onMouseDown={() => {
										onChange(option);
										setOpen(false);
									}}
									onKeyDown={(e) =>
										handleKeyDown(e, option, index)
									}
									tabIndex={0}
								>
									<span>{option}</span>
									<span className="text-accent text-xl pt-[1px]">
										{option === value ? <TiTick /> : ""}
									</span>
								</div>
							))}
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
}
