import { vaultItemSchema, vaultTypeSchema } from "@/schemas/vault";
import type { VaultItem } from "@/types/vault";
import { AccentButton } from "@components/AccentButton";
import { CreateLoginItem } from "@components/create/Login";
import { LabeledInput } from "@components/LabeledInput";
import { TagsField } from "@components/TagsField";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { LabeledDropdown } from "./LabeledDropdown";
import { CreateCardItem } from "./create/Card";
import { Modal } from "./Modal";
import { CreateIdentityItem } from "./create/Identity";
import { DevTool } from "@hookform/devtools";
import { CreateNoteItem } from "./create/Note";
import { useStore } from "@stores/store";
import { useShallow } from "zustand/shallow";

type NewItemModalProps = {
	open: boolean;
	close: () => void;
};

export function NewItemModal({ open, close }: NewItemModalProps) {
	const { addItem, saveVault } = useStore(
		useShallow(({ addItem, saveVault }) => ({
			addItem,
			saveVault,
		})),
	);
	const form = useForm<VaultItem>({
		resolver: zodResolver(vaultItemSchema),
		defaultValues: {
			type: "login",
			tags: [],
			id: crypto.randomUUID(),
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		},
	});

	const {
		handleSubmit,
		register,
		watch,
		control,
		reset,
		formState: { isSubmitting, errors },
	} = form;

	const closeModal = useCallback(() => {
		close();
		reset();
	}, [close, reset]);

	const onSubmit = async (data: VaultItem) => {
		addItem(data);
		toast.success("Item added successfully!");
		closeModal();
		toast.promise(saveVault(), {
			loading: "Saving vault...",
			success: "Vault saved!",
			error: (error) => `Error saving vault: ${error.message}`,
		});
	};

	return (
		<Modal open={open} close={closeModal} title="Add New Item">
			<FormProvider {...form}>
				<form
					onSubmit={handleSubmit(onSubmit, () =>
						toast.error("Please fix the errors in the form."),
					)}
					className="w-full flex flex-col gap-4"
				>
					<div className="w-full flex gap-2">
						<LabeledInput
							label="Name"
							id="name"
							{...register("name")}
							error={errors.name?.message}
							containerClassName="flex-5 min-w-0"
						/>
						<Controller
							name="type"
							control={control}
							render={({ field }) => (
								<LabeledDropdown
									label="Type"
									value={field.value}
									options={vaultTypeSchema.options}
									onChange={field.onChange}
									onBlur={field.onBlur}
								/>
							)}
						/>
					</div>
					<TagsField />
					{watch("type") === "login" && <CreateLoginItem />}
					{watch("type") === "card" && <CreateCardItem />}
					{watch("type") === "identity" && <CreateIdentityItem />}
					{watch("type") === "note" && <CreateNoteItem />}
					<AccentButton disabled={isSubmitting} type="submit">
						{isSubmitting ? "Saving..." : "Save Item"}
					</AccentButton>
				</form>
			</FormProvider>
			<DevTool control={control} />
		</Modal>
	);
}
