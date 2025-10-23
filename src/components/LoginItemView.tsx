import type { LoginItem, VaultItem } from "@/types/vault";
import { getFaviconUrl } from "@utils/extractHostname";
import { AccentButton } from "./AccentButton";
import { useState, type ComponentProps } from "react";
import { LuEye, LuEyeOff } from "react-icons/lu";
import * as motion from "motion/react-client";
import { AnimatePresence } from "motion/react";
import clsx from "clsx";

type LoginItemViewProps = {
	item: VaultItem;
};

export function LoginItemView({ item }: LoginItemViewProps) {
	const { username, password, url, tags, name } = item as LoginItem;

	return (
		<div className="flex flex-col gap-4">
			<div className="flex gap-4 justify-start items-center">
				<div className="aspect-square h-full max-h-12 rounded-lg bg-white p-1.5 shadow flex items-center justify-center">
					<img
						src={getFaviconUrl(url)}
						alt={"Favicon"}
						className="bg-white object-cover"
					/>
				</div>
				<div className="flex flex-col gap-1 justify-between">
					<span className="font-bold text-2xl">{name}</span>
				</div>
			</div>
			{tags.length > 0 && (
				<div className="flex flex-wrap gap-1">
					{tags.map(({ value }) => (
						<span className="rounded-xl bg-accent text-sm py-1 px-2 font-medium">
							{value}
						</span>
					))}
				</div>
			)}
			<FieldRow label="URL" value={url} />
			<FieldRow label="Username" value={username} />
			<SensetiveFieldRow label="Password" value={password} />
		</div>
	);
}

type FieldRowProps = {
	label: string;
	value: string;
};
function FieldRow({ label, value }: FieldRowProps) {
	return (
		<div className="flex w-full justify-between items-center">
			<div className="flex flex-col">
				<span className="text-xs text-text-secondary">{label}</span>
				<span className="text-lg">{value}</span>
			</div>
			<AccentButton className="w-min px-3 text-sm" onClick={() => {}}>
				Copy
			</AccentButton>
		</div>
	);
}

function SensetiveFieldRow({ label, value }: FieldRowProps) {
	const [isVisible, setIsVisible] = useState(false);

	return (
		<div className="flex w-full justify-between items-center">
			<div className="flex flex-col">
				<span className="text-xs text-text-secondary">{label}</span>
				<div className="flex items-center gap-2">
					<span className="text-lg">
						{isVisible ? value : "••••••••"}
					</span>
					<PasswordVisibilityToggle
						isVisible={isVisible}
						onClick={() => setIsVisible(!isVisible)}
					/>
				</div>
			</div>
			<div className="flex gap-2 items-center">
				<AccentButton className="w-min px-3 text-sm" onClick={() => {}}>
					Copy
				</AccentButton>
			</div>
		</div>
	);
}

type PasswordVisibilityToggleProps = ComponentProps<typeof motion.button> & {
	isVisible: boolean;
};
function PasswordVisibilityToggle({
	isVisible,
	...props
}: PasswordVisibilityToggleProps) {
	return (
		<motion.button
			type="button"
			className={clsx([
				"text-xl",
				"text-text-secondary hover:text-text cursor-pointer",
			])}
			tabIndex={-1}
			whileHover={{ scale: 1.15 }}
			whileTap={{ scale: 0.9 }}
			transition={{ duration: 0.075 }}
			{...props}
		>
			<AnimatePresence mode="wait">
				{isVisible ? (
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
	);
}
