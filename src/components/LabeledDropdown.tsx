import { LuChevronsUpDown } from "react-icons/lu";
import clsx from "clsx";
import {
	useEffect,
	useRef,
	useState,
	type FocusEvent,
	type RefObject,
} from "react";
import { TiTick } from "react-icons/ti";

type LabeledDropdownProps = {
	label: string;
	value: string;
	options: string[];
	onChange: (value: string) => void;
	onBlur?: (e: FocusEvent<unknown>) => void;
};

function focusWithin(
	container: HTMLElement | null,
	relatedTarget: EventTarget | null,
) {
	if (!container || !relatedTarget) return false;
	return container.contains(relatedTarget as Node);
}

const selectNext = (optionsRef: RefObject<HTMLDivElement[]>, index: number) => {
	if (index < optionsRef.current.length - 1) {
		optionsRef.current[index + 1].focus();
	} else {
		optionsRef.current[0].focus();
	}
};

const selectPrevious = (
	optionsRef: RefObject<HTMLDivElement[]>,
	index: number,
) => {
	if (index > 0) {
		optionsRef.current[index - 1].focus();
	} else {
		optionsRef.current[optionsRef.current.length - 1].focus();
	}
};

export function LabeledDropdown({
	label,
	value,
	options,
	onChange,
	onBlur,
}: LabeledDropdownProps) {
	const [open, setOpen] = useState<boolean>(false);
	const optionContainerRef = useRef<HTMLDivElement>(null);
	const buttonRef = useRef<HTMLButtonElement>(null);
	const optionsRef = useRef<HTMLDivElement[]>([]);

	const handleBlur = (e: FocusEvent) => {
		// only fire onBlur if none of the childrens are focused
		if (focusWithin(optionContainerRef.current, e.relatedTarget)) {
			return;
		}
		setOpen(false);
		if (onBlur) onBlur(e);
	};

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
			<label htmlFor="type" className={`text-sm font-bold`}>
				{label}
			</label>
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
				{open && (
					<div
						className={clsx([
							"absolute z-10 mt-2 p-1 w-full max-h-60",
							"bg-neutral-900 border-1 border-neutral-600",
							"rounded-xl shadow-lg",
							"overflow-y-auto transition",
						])}
					>
						{options.map((option, index) => (
							<div
								key={option}
								className={clsx([
									"m-1 p-2 pl-2 hover:bg-neutral-800 cursor-pointer",
									"focus:bg-neutral-800 outline-none",
									"rounded-lg overflow-hidden",
									"flex justify-between",
								])}
								ref={(el) => {
									if (el) optionsRef.current[index] = el;
								}}
								onMouseDown={() => {
									onChange(option);
									setOpen(false);
								}}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										e.preventDefault();
										onChange(option);
										setOpen(false);
									} else if (e.key === "ArrowDown")
										selectNext(optionsRef, index);
									else if (e.key === "ArrowUp")
										selectPrevious(optionsRef, index);
									else if (e.key === "Escape") {
										e.preventDefault();
										setOpen(false);
										buttonRef.current?.focus();
									} else if (e.key === "Tab") {
										e.preventDefault();
										if (e.shiftKey)
											selectPrevious(optionsRef, index);
										else selectNext(optionsRef, index);
									}
								}}
								tabIndex={0}
							>
								<span>{option}</span>
								<span className="text-accent text-xl pt-[1px]">
									{option === value ? <TiTick /> : ""}
								</span>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
