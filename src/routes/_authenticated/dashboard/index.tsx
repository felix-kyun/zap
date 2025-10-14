import { NavBar } from "@components/NavBar";
import { NewItemModal } from "@components/NewItemModal";
import { VaultItemPreview } from "@components/VaultItemPreview";
import { useModal } from "@hooks/useModal";
import { useVault } from "@hooks/useVault";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/dashboard/")({
	component: RouteComponent,
});

function RouteComponent() {
	const [vault, UnlockModal] = useVault();
	const [CreationModal, creationModalState] = useModal(NewItemModal);

	if (vault.state === "locked") {
		return UnlockModal;
	}

	return (
		<>
			{UnlockModal}
			{CreationModal}
			<NavBar />
			<div className="max-w-3xl mx-auto p-4">
				{vault.items.length === 0 && (
					<p>No entries found. Start by adding a new entry!</p>
				)}
				{vault.items.length > 0 && (
					<div className="flex flex-col gap-4">
						{vault.items.map((item) => (
							<VaultItemPreview key={item.id} item={item} />
						))}
					</div>
				)}
			</div>
		</>
	);
}
