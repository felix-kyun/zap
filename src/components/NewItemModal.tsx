import { vaultItemSchema, vaultTypeSchema } from "@/schemas/vault";
import type { VaultItem } from "@/types/vault";
import { AccentButton } from "@components/AccentButton";
import { CreateLoginItem } from "@components/create/Login";
import { LabeledInput } from "@components/LabeledInput";
import { TagsField } from "@components/TagsField";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { RiCloseLargeFill } from "react-icons/ri";
import { LabeledDropdown } from "./LabeledDropdown";

type NewItemModalProps = {
	open: boolean;
	close: () => void;
};

export function NewItemModal({ open, close }: NewItemModalProps) {
	// listen for esc to close modal
	useEffect(() => {
		if (!open) return;

		const handleEvent = (e: KeyboardEvent) => {
			if (e.key === "Escape") close();
		};

		window.addEventListener("keydown", handleEvent);

		return () => window.removeEventListener("keydown", handleEvent);
	}, [open, close]);

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
		formState: { isSubmitting, errors },
	} = form;

	const onSubmit = (data: VaultItem) => {
		console.log("submitted", data);
	};

	if (!open) return null;

	return (
		<div
			className="fixed z-50 inset-0 flex justify-center items-center bg-neutral-950/50 backdrop-blur"
			onClick={close}
		>
			<div className="container min-h-screen flex flex-col mx-auto justify-center items-center p-8">
				<div
					className="relative flex flex-col w-full max-w-xl px-12 pt-8 pb-12 rounded-xl shadow-lg sm:border-[1px] border-border"
					onClick={(e) => e.stopPropagation()}
				>
					<span className="text-3xl font-bold mb-4">Create Item</span>
					<span
						className="absolute top-8 right-8 cursor-pointer text-2xl text-neutral-600 hover:text-neutral-400 transition"
						onClick={close}
					>
						<RiCloseLargeFill />
					</span>
					<FormProvider {...form}>
						<form
							onSubmit={handleSubmit(onSubmit, () =>
								toast.error(
									"Please fix the errors in the form.",
								),
							)}
							className="w-full"
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
							<TagsField type={watch("type")} />
							{watch("type") === "login" && <CreateLoginItem />}
							<AccentButton disabled={isSubmitting} type="submit">
								{isSubmitting ? "Saving..." : "Save Item"}
							</AccentButton>
						</form>
					</FormProvider>
				</div>
			</div>
		</div>
	);
}
