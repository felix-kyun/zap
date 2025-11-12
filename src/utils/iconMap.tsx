import type { ComponentType, JSX } from "react";
import { BiSolidCustomize } from "react-icons/bi";
import { FaUsers } from "react-icons/fa";
import { FaCreditCard,FaNoteSticky } from "react-icons/fa6";
import { MdPassword } from "react-icons/md";

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
