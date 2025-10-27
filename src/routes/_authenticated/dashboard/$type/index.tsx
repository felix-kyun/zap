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
import { useState } from "react";

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

function RouteComponent() {
    const vault = useStore((state) => state.vault);
    const search = useStore((state) => state.query);
    const [ItemView, ItemViewState] =
        useModalWithProps<ItemViewModalProps>(ItemViewModal);
    const [selectedItem, setSelectedItem] = useState<VaultItem | null>(null);
    const type = Route.useLoaderData();

    if (!vault || vault.state === "locked") {
        return null;
    }

    const items = vault.items
        .filter((item) => type === "all" || item.type === type)
        .filter(
            (item) =>
                item.name.toLowerCase().includes(search.toLowerCase()) ?? true,
        );

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
