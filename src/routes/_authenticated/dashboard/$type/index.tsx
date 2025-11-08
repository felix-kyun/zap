import { vaultTypeSchema } from "@/schemas/vault";
import type { VaultItem } from "@/types/vault";
import { CardItemPreview } from "@components/CardItemPreview";
import {
	ItemViewModal,
	type ItemViewModalProps,
} from "@components/ItemViewModal";
import { LoginItemPreview } from "@components/LoginItemPreview";
import { NoteItemPreview } from "@components/NoteItemPreview";
import { VaultItemPreview } from "@components/VaultItemPreview";
import { useModalWithProps } from "@hooks/useModalWithProps";
import { useStore } from "@stores/store";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence } from "motion/react";
import type { FunctionComponent } from "react";
import { useMemo, useState } from "react";

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

const previewMap: Record<
	VaultItem["type"],
	FunctionComponent<{ item: VaultItem; index: number; onClick?: () => void }>
> = {
	login: LoginItemPreview,
	card: CardItemPreview,
	identity: VaultItemPreview,
	note: NoteItemPreview,
	custom: VaultItemPreview,
};

// TODO: optimize filtering to filter in O(n)
type FilterFunction = (item: VaultItem) => boolean;
function filter(item: Array<VaultItem>, type: string, _search: string) {
	const search: string = _search.trim();

	const filters: Array<FilterFunction> = [
		(item) => type === "all" || item.type === type,
		(item) => item.name.toLowerCase().includes(search.toLowerCase()),
		(item) =>
			item.type !== "note" ||
			item.content.toLowerCase().includes(search.toLowerCase()),
	];

	return item.filter((i) => filters.every((f) => f(i)));
}

function RouteComponent() {
	const vault = useStore((state) => state.vault);
	const search = useStore((state) => state.query);
	const [ItemView, ItemViewState] =
		useModalWithProps<ItemViewModalProps>(ItemViewModal);
	const [selectedItem, setSelectedItem] = useState<VaultItem | null>(null);
	const type = Route.useLoaderData();

	const items = useMemo(() => {
		if (!vault || vault.state === "locked") return [];

		return filter(vault.items, type, search);
	}, [vault, type, search]);

	if (!vault || vault.state === "locked") {
		return null;
	}

	return (
		<div className="grid grid-cols-[repeat(auto-fit,minmax(18rem,1fr))] gap-4">
			<AnimatePresence>
				{items.map((item, index) => {
					const PreviewComponent = previewMap[item.type];
					return (
						<PreviewComponent
							key={item.id}
							item={item}
							index={index}
							onClick={() => {
								setSelectedItem(item);
								ItemViewState.open();
							}}
						/>
					);
				})}
			</AnimatePresence>
			{ItemView({ item: selectedItem })}
		</div>
	);
}
