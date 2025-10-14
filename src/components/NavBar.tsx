import ZapLogo from "@/assets/zap.png";
import { useStore } from "@stores/store";
import { FiLogOut } from "react-icons/fi";
import { FaUser } from "react-icons/fa";
import { iconMap } from "@/utils/iconMap";

export function NavBar() {
	const user = useStore((state) => state.user);

	return (
		<div className="mx-6 md:mx-12 my-4 grid grid-cols-3 grid-rows-1 items-center font-font">
			<div className="flex items-center gap-2">
				<img src={ZapLogo} alt="Zap Logo" className="h-8 md:h-12" />
				<span className="text-lg md:text-2xl font-bold">
					Zap<span className="text-2xl font-bold text-accent">!</span>
				</span>
			</div>
			<div className="flex justify-center text-lg md:text-xl font-medium items-center gap-8">
				{Object.entries(iconMap).map(([type, Icon]) => (
					<span key={type} className="flex items-center gap-2">
						<Icon />
					</span>
				))}
			</div>
			<div className="flex justify-end items-center gap-2">
				{user && (
					<>
						<FaUser className="text-accent text-lg md:text-xl" />
						<span className="font-bold text-sm md:text-lg">
							{user.username}
						</span>
						<FiLogOut className="text-lg md:text-xl cursor-pointer hover:text-neutral-600 transition-all" />
					</>
				)}
			</div>
		</div>
	);
}
