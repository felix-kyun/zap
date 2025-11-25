import { useRef, useState } from "react";
import clsx from "clsx";
import { AccentButton } from "./AccentButton";

type OtpComponentProps = {
	onSubmit: (otp: string) => Promise<void>;
};

export function OtpComponent({ onSubmit }: OtpComponentProps) {
	const [otp, setOtp] = useState<Array<string>>(new Array(6).fill(""));
	const [isSubmitting, setIsSubmitting] = useState(false);
	const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

	const submit = async (otp: string) => {
		setIsSubmitting(true);
		await onSubmit(otp);
		setIsSubmitting(false);
	};

	const handleChange = async (
		e: React.ChangeEvent<HTMLInputElement>,
		index: number,
	) => {
		const value = e.target.value;
		if (!/^\d*$/.test(value)) return;

		const newOtp = [...otp];
		newOtp[index] = value;
		setOtp(newOtp);

		// focus next
		if (value && index < 5) {
			inputRefs.current[index + 1]?.focus();
		}

		// auto submit
		if (newOtp.every((digit) => digit !== ""))
			await submit(newOtp.join(""));
	};

	const handleKeyDown = (
		e: React.KeyboardEvent<HTMLInputElement>,
		index: number,
	) => {
		if (e.key === "Backspace" && index >= 0 && index < 6) {
			if (inputRefs.current[index] && otp[index] !== "") {
				const newOtp = [...otp];
				newOtp[index] = "";
				setOtp(newOtp);
			}
			if (index > 0 && inputRefs.current[index - 1])
				inputRefs.current[index - 1]?.focus();
		} else if (e.key === "ArrowLeft" && index > 0) {
			inputRefs.current[index - 1]?.focus();
		} else if (e.key === "ArrowRight" && index < 6) {
			inputRefs.current[index + 1]?.focus();
		}
	};

	const handlePaste = (
		e: React.ClipboardEvent<HTMLInputElement>,
		index: number,
	) => {
		const paste = e.clipboardData.getData("Text").trim();
		if (!/^\d+$/.test(paste)) return;

		const newOtp = [...otp];
		let i = index;
		for (const char of paste) {
			if (i < 6) {
				newOtp[i] = char;
				i++;
			} else break;
		}
		setOtp(newOtp);

		requestAnimationFrame(async () => {
			if (newOtp.every((digit) => digit !== ""))
				await submit(newOtp.join(""));
			else if (inputRefs.current[Math.min(i, 5)]) {
				inputRefs.current[Math.min(i, 5)]?.focus();
			}
		});
	};

	return (
		<div className="flex flex-col gap-6 items-center">
			<h2 className="text-2xl font-bold">Enter OTP</h2>
			<div className="flex space-between gap-4">
				{otp.map((value, index) => (
					<input
						key={index}
						type="text"
						maxLength={1}
						value={value}
						inputMode="numeric"
						disabled={isSubmitting}
						onChange={(e) => handleChange(e, index)}
						onKeyDown={(e) => handleKeyDown(e, index)}
						onPaste={(e) => handlePaste(e, index)}
						onFocus={(e) => e.target.select()}
						ref={(el) => {
							if (inputRefs.current)
								inputRefs.current[index] = el;
						}}
						className={clsx([
							"h-16 w-14 text-center text-3xl",
							"border border-border rounded-lg",
							"flex items-center justify-center",
							"focus:border-accent focus:outline-none",
							"disabled:text-text-secondary/50 disabled:cursor-not-allowed",
						])}
					/>
				))}
			</div>
			<AccentButton disabled={isSubmitting} onClick={submit}>
				{isSubmitting ? "Verifying..." : "Submit"}
			</AccentButton>
		</div>
	);
}
