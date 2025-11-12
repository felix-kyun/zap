import { SideBar } from "@components/SideBar";
import { useVault } from "@hooks/useVault";
import { useStore } from "@stores/store";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { greeting } from "@utils/greeting";

export const Route = createFileRoute("/_authenticated/dashboard")({
	component: RouteComponent,
});

function RouteComponent() {
	const [, UnlockModal] = useVault();
	const username = useStore((state) => state.user?.username);

	return (
		<>
			{UnlockModal}
			<div className="flex h-screen w-screen">
				<SideBar className="min-w-64 lg:min-w-75" />
				<div className="flex-grow-1 m-4 p-4 pb-0 overflow-y-auto scrollbar-hide">
					<div className="flex justify-between items-center mb-8">
						<h1 className="text-3xl font-bold">
							{greeting(username ?? "User")}
						</h1>
					</div>
					<Outlet />
				</div>
			</div>
		</>
	);
}
