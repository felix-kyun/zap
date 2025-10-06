import { useStore } from "@stores/store";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/dashboard/")({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = Route.useNavigate();
	const vault = useStore((state) => state.vault);

	// shouldn't happen, as loader should load it
	if (!vault) return null;

	return (
		<div>
			<h1>Dashboard</h1>
			<button
				onClick={() =>
					navigate({
						to: "new",
					})
				}
				className="mb-4 px-4 py-2 bg-blue-500 text-white rounded m-4"
			>
				Add New Entry
			</button>
			{vault.items.length === 0 && (
				<p>No entries found. Start by adding a new entry!</p>
			)}
		</div>
	);
}
