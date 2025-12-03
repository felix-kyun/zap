import { AnimatePresence } from "motion/react";
import * as motion from "motion/react-client";
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
			<div className={`flex flex-col w-full gap-1 ${containerClassName}`}>
				{(label || error) && (
					<div className="flex justify-between items-center">
						{label && (
							<label
								htmlFor={id}
								className={`font-semibold text-sm ${labelClassName}`}
							>
								{label}
							</label>
						)}
						<AnimatePresence>
							{error && (
								<motion.span
									className="text-error text-sm"
									initial={{ opacity: 0, height: 0 }}
									animate={{ opacity: 1, height: "auto" }}
									exit={{ opacity: 0, height: 0 }}
									transition={{ duration: 0.25 }}
								>
									{error}
								</motion.span>
							)}
						</AnimatePresence>
					</div>
				)}
				<input
					type={type ?? "text"}
					name={id}
					id={id}
					ref={ref}
					autoComplete="off"
					readOnly
					onFocus={(e) => e.target.removeAttribute("readonly")}
					className={`border rounded-xl py-2 px-4 font-medium border-border-secondary bg-prompt placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-ring transition duration-200 ${inputClassName}`}
					{...inputProps}
				/>
			</div>
		);
	},
);
