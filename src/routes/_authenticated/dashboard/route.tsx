import { createFileRoute, Outlet } from "@tanstack/react-router";
import { NewItemModal } from "@components/NewItemModal";
import { SideBar } from "@components/SideBar";
import { useVault } from "@hooks/useVault";

export const Route = createFileRoute("/_authenticated/dashboard")({
	component: RouteComponent,
});

function RouteComponent() {
	const [vault, UnlockModal] = useVault();

	if (vault.state === "locked") {
		return UnlockModal;
	}

	return (
		<>
			{UnlockModal}
			<NewItemModal />
			<div className="flex h-screen w-screen">
				<SideBar className="min-w-64 lg:min-w-75" />
				<div className="flex-grow-1 m-5 p-4 overflow-y-auto">
					<div className="flex justify-between items-center mb-8">
						<h1 className="text-3xl font-bold">Your Vault</h1>
					</div>
					<Outlet />
				</div>
			</div>
		</>
	);
}
