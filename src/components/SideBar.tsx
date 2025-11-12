import { LabeledInput } from "@components/LabeledInput";
import { MenuOption } from "@components/MenuOption";
import { NewItemModal } from "@components/NewItemModal";
import { logout } from "@services/auth.service";
import { useStore } from "@stores/store";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { iconMap } from "@utils/iconMap";
import { useCallback, useState } from "react";
import { FaAsterisk } from "react-icons/fa";
import { IoIosCreate, IoMdSettings } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import { useShallow } from "zustand/shallow";

import { vaultTypeSchema } from "@/schemas/vault";

type SideBarProps = {
	className?: string;
};

export function SideBar({ className }: SideBarProps) {
	const user = useStore((state) => state.user);
	const clearVault = useStore((state) => state.clearVault);
	const clearUser = useStore((state) => state.clearUser);
	const [creationModalState, setCreationModalState] = useState(false);
	const navigate = useNavigate();
	const { type: currentRouteType } = useParams({
		from: "/_authenticated/dashboard/$type/",
	});
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
		<>
			<NewItemModal
				open={creationModalState}
				close={() => setCreationModalState(false)}
				mode="create"
			/>
			<div
				className={`hidden sm:flex flex-col justify-between h-screen p-4 border-r-1 border-r-border ${className}`}
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
						<Link
							to={`/dashboard/$type`}
							params={{ type: "all" }}
							key="all"
						>
							<MenuOption active={"all" === currentRouteType}>
								<FaAsterisk />
								All
							</MenuOption>
						</Link>
						{[...vaultTypeSchema.options].map((type) => {
							const Icon = iconMap[type];
							return (
								<Link
									to={`/dashboard/$type`}
									params={{ type }}
									key={type}
								>
									<MenuOption
										active={type === currentRouteType}
									>
										<Icon />
										{type}
									</MenuOption>
								</Link>
							);
						})}
					</div>
					<div className="flex flex-col mb-3">
						<MenuOption onClick={() => setCreationModalState(true)}>
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
		</>
	);
}
