import { NewItemModal } from "@components/NewItemModal";
import { useStore } from "@stores/store";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/dashboard/")({
	component: RouteComponent,
});

function RouteComponent() {
	const vault = useStore((state) => state.vault);
	const [createNewState, setCreateNewState] = useState<boolean>(false);

	// shouldn't happen, as loader should load it
	if (!vault) return null;

	return (
		<>
			<NewItemModal
				open={createNewState}
				close={() => setCreateNewState((value) => !value)}
			/>
			<div>
				<h1>Dashboard</h1>
				<button
					onClick={() => setCreateNewState(() => !createNewState)}
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
