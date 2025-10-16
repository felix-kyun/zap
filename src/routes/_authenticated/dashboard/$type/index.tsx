import { vaultTypeSchema } from "@/schemas/vault";
import { VaultItemPreview } from "@components/VaultItemPreview";
import { useStore } from "@stores/store";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/dashboard/$type/")({
	component: RouteComponent,
	beforeLoad: ({ params }) => {
		const { type } = params;
		const validType = [...vaultTypeSchema.options, "all"];

		if (!validType.includes(type)) {
			throw new Error("Invalid type");
		}
	},
	loader: ({ params }) => {
		const type = params.type as unknown as
			| (typeof vaultTypeSchema.options)[number]
			| "all";

		return type;
	},
});

function RouteComponent() {
	const vault = useStore((state) => state.vault);
	const search = useStore((state) => state.query);
	const type = Route.useLoaderData();

	if (!vault || vault.state === "locked") {
		return null;
	}

	return (
		<div className="flex flex-col gap-4">
			{vault.items
				.filter((item) => type === "all" || item.type === type)
				.filter(
					(item) =>
						item.name
							.toLowerCase()
							.includes(search.toLowerCase()) ?? true,
				)
				.map((item) => (
					<VaultItemPreview
						key={`${item.id}-${item.createdAt}`}
						item={item}
					/>
				))}
		</div>
	);
}
