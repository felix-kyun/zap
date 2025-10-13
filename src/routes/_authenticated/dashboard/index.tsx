import { NewItemModal } from "@components/NewItemModal";
import { useModal } from "@hooks/useModal";
import { useVault } from "@hooks/useVault";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/dashboard/")({
	component: RouteComponent,
});

function RouteComponent() {
	const [vault, UnlockModal] = useVault();
	const [CreationModal, creationModalState] = useModal(NewItemModal);

	return (
		<>
			{UnlockModal}
			{CreationModal}
			<div>
				<h1>Dashboard</h1>
				<button
					onClick={() => creationModalState.open()}
					className="mb-4 px-4 py-2 bg-blue-500 text-white rounded m-4"
				>
					Add New Entry
				</button>
				{vault.items.length === 0 && (
					<p>No entries found. Start by adding a new entry!</p>
				)}
			</div>
		</>
	);
}
