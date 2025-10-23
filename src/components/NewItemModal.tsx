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
import { LabeledDropdown } from "@components/LabeledDropdown";
import { CreateCardItem } from "@components/create/Card";
import { Modal } from "@components/Modal";
import { CreateIdentityItem } from "@components/create/Identity";
import { CreateNoteItem } from "@components/create/Note";
import { useStore } from "@stores/store";
import { useShallow } from "zustand/shallow";

export function NewItemModal() {
	const { addItem, saveVault } = useStore(
		useShallow(({ addItem, saveVault }) => ({
			addItem,
			saveVault,
		})),
	);

	const [open, setOpen] = useStore(
		useShallow((state) => [
			state.creationModalState,
			state.setCreationModal,
		]),
	);

	const form = useForm<VaultItem>({
		resolver: zodResolver(vaultItemSchema),
		defaultValues: {
			type: "login",
			tags: [],
			// replace this later on or else it will be same for every item unless page is refreshed
			// its just to pass zod validation
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
		setOpen(false);
		reset();
	}, [setOpen, reset]);

	// IMP: add some way to know if the server has newer version of the vault
	// if so then fetch update and then add the item and save again
	const onSubmit = async (data: VaultItem) => {
		try {
			addItem({
				...data,
				id: crypto.randomUUID(),
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			});
		} catch (error) {
			toast.error(`Error adding item: ${(error as Error).message}`);
		}
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
							autoFocus
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
		</Modal>
	);
}
