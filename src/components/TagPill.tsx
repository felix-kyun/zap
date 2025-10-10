import type { HTMLAttributes } from "react";

type TagPillProps = {
	value: string;
};

export function TagPill({
	value,
	...rest
}: TagPillProps & HTMLAttributes<HTMLSpanElement>) {
	return (
		<span
			className="rounded-xl bg-accent py-1 px-3 font-medium text-sm"
			{...rest}
		>
			{value}
		</span>
	);
}
