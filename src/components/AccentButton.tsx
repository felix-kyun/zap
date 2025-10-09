import type { ButtonHTMLAttributes } from "react";

export function AccentButton({
	children,
	...rest
}: ButtonHTMLAttributes<HTMLButtonElement>) {
	return (
		<button
			type="submit"
			className="bg-accent text-text p-2 mt-4 rounded-xl w-full font-medium"
			{...rest}
		>
			{children}
		</button>
	);
}
