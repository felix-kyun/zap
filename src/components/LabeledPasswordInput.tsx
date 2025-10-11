import {
	forwardRef,
	useCallback,
	useState,
	type InputHTMLAttributes,
} from "react";
import * as motion from "motion/react-client";
import { AnimatePresence } from "motion/react";
import clsx from "clsx";
import { LuEye, LuEyeOff } from "react-icons/lu";

type LabeledPasswordInputProps = InputHTMLAttributes<HTMLInputElement> & {
	id: string;
	label: string;
	error?: string;
	inputClassName?: string;
	labelClassName?: string;
	containerClassName?: string;
};

export const LabeledPasswordInput = forwardRef<
	HTMLInputElement,
	LabeledPasswordInputProps
>(
	(
		{
			id,
			label,
			error,
			inputClassName,
			labelClassName,
			containerClassName,
			...inputProps
		},
		ref,
	) => {
		const [showPassword, setShowPassword] = useState<boolean>(false);

		const toggleShowPassword = useCallback(() => {
			setShowPassword((s) => !s);
		}, []);

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
				<div className="relative w-full">
					<input
						key={showPassword ? "text" : "password"}
						type={showPassword ? "text" : "password"}
						name={id}
						id={id}
						ref={ref}
						autoComplete="off"
						readOnly
						onFocus={(e) => e.target.removeAttribute("readonly")}
						className={clsx([
							"rounded-xl py-2 px-4 w-full font-medium",
							"border-neutral-600 bg-neutral-900 placeholder:text-neutral-400 focus:ring-accent",
							"border-[1px] focus:outline-none focus:ring-2",
							"transition duration-200",
							inputClassName,
						])}
						{...inputProps}
					/>
					<motion.button
						type="button"
						className={clsx([
							"absolute text-xl top-1/2 -translate-y-1/2 right-3",
							"text-neutral-400 hover:text-neutral-200",
						])}
						tabIndex={-1}
						onClick={toggleShowPassword}
						whileHover={{ scale: 1.15 }}
						whileTap={{ scale: 0.9 }}
						transition={{ duration: 0.075 }}
					>
						<AnimatePresence mode="wait">
							{showPassword ? (
								<motion.span
									key="eye-off"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 0.18 }}
								>
									<LuEyeOff />
								</motion.span>
							) : (
								<motion.span
									key="eye"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 0.18 }}
								>
									<LuEye />
								</motion.span>
							)}
						</AnimatePresence>
					</motion.button>
				</div>
				<AnimatePresence>
					{error && (
						<motion.span
							className="text-error text-sm"
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: "auto" }}
							exit={{ opacity: 0, height: 0 }}
							transition={{ duration: 0.25, delay: 0.15 }}
						>
							{error}
						</motion.span>
					)}
				</AnimatePresence>
			</div>
		);
	},
);
