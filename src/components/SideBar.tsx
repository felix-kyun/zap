import { LabeledInput } from "@components/LabeledInput";
import { vaultTypeSchema } from "@/schemas/vault";
import { iconMap } from "@utils/iconMap";
import { useStore } from "@stores/store";
import { MenuOption } from "@components/MenuOption";
import { IoIosCreate, IoMdSettings } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import { logout } from "@services/auth.service";
import { useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";
import { useShallow } from "zustand/shallow";

type SideBarProps = {
	className?: string;
};

export function SideBar({ className }: SideBarProps) {
	const user = useStore((state) => state.user);
	const clearVault = useStore((state) => state.clearVault);
	const clearUser = useStore((state) => state.clearUser);
	const setCreationModal = useStore((state) => state.setCreationModal);
	const navigate = useNavigate();
	const [search, setSearch] = useStore(
		useShallow((state) => [state.query, state.setQuery]),
	);

	const handleLogout = useCallback(async () => {
		await logout();
		clearVault();
		clearUser();
		navigate({ to: "/login" });
	}, [navigate, clearVault, clearUser]);

	return (
		<div
			className={`flex flex-col justify-between h-screen p-4 border-r-1 border-r-border ${className}`}
		>
			<div className="flex flex-col">
				<div className="flex justify-center items-center gap-2 my-2">
					<span className="text-4xl font-bold">
						Zap
						<span className="text-4xl font-bold text-accent">
							!
						</span>
					</span>
				</div>
				<LabeledInput
					id="search"
					label=""
					type="text"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					placeholder="Search"
					containerClassName="my-4"
				/>
			</div>
			<div className="flex flex-col flex-grow justify-between">
				<div className="flex flex-col">
					{[...vaultTypeSchema.options].map((type) => {
						const Icon = iconMap[type];
						return (
							<MenuOption key={type}>
								<Icon />
								{type}
							</MenuOption>
						);
					})}
				</div>
				<div className="flex flex-col mb-3">
					<MenuOption onClick={() => setCreationModal(true)}>
						<IoIosCreate /> Create New
					</MenuOption>
					<MenuOption>
						<IoMdSettings /> Settings
					</MenuOption>
					<MenuOption onClick={handleLogout}>
						<IoLogOut /> Log Out
					</MenuOption>
				</div>
			</div>
			<div>
				<div className="flex justify-start items-center rounded-xl p-3 bg-surface gap-3 border-1 border-border shadow-lg">
					<img
						src={`https://api.dicebear.com/9.x/lorelei-neutral/svg?seed=${user?.username}&size=32&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`}
						alt="User Avatar"
						className="h-10 w-10 rounded-xl"
					/>
					<div className="flex flex-col justify-center">
						<span className="font-bold">{user?.username}</span>
						<span className="text-sm text-neutral-500">
							{user?.email}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
