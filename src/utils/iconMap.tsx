import { FaUsers } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { FaNoteSticky, FaCreditCard } from "react-icons/fa6";
import { BiSolidCustomize } from "react-icons/bi";
import type { ComponentType, JSX } from "react";
import type { VaultType } from "@/types/vault";

type IconMap = {
	[key in VaultType]: ComponentType<JSX.IntrinsicElements["svg"]>;
};

export const iconMap: IconMap = {
	login: MdPassword,
	card: FaCreditCard,
	identity: FaUsers,
	note: FaNoteSticky,
	custom: BiSolidCustomize,
} as const;
