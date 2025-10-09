import { forwardRef, type InputHTMLAttributes } from "react";

type LabeledInputProps = InputHTMLAttributes<HTMLInputElement> & {
	id: string;
	label: string;
	type?: string;
	error?: string;
	inputClassName?: string;
	labelClassName?: string;
	containerClassName?: string;
};

export const LabeledInput = forwardRef<HTMLInputElement, LabeledInputProps>(
	(
		{
			id,
			label,
			type,
			error,
			inputClassName,
			labelClassName,
			containerClassName,
			...inputProps
		},
		ref,
	) => {
		return (
			<div
				className={`flex flex-col w-full gap-2 mb-4 ${containerClassName}`}
			>
				<label
					htmlFor={id}
					className={`font-bold text-sm ${labelClassName}`}
				>
					{label}
				</label>
				<input
					type={type ?? "text"}
					name={id}
					id={id}
					ref={ref}
					className={`border-[1px] rounded-xl py-2 px-4 font-medium border-neutral-600 bg-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-accent transition duration-200 ${inputClassName}`}
					{...inputProps}
				/>
				<div className="text-error text-sm">{error}</div>
			</div>
		);
	},
);
