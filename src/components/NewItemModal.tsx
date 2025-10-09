import { vaultItemSchema } from "@/schemas/vault";
import type { VaultItem } from "@/types/vault";
import { AccentButton } from "@components/AccentButton";
import { CreateLoginItem } from "@components/create/Login";
import { LabeledInput } from "@components/LabeledInput";
import { TagsField } from "@components/TagsField";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { LuChevronsUpDown } from "react-icons/lu";
import { RiCloseLargeFill } from "react-icons/ri";

type NewItemModalProps = {
	open: boolean;
	close: () => void;
};

export function NewItemModal({ open, close }: NewItemModalProps) {
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
									label="name"
									id="name"
									{...register("name")}
									error={errors.name?.message}
									containerClassName="flex-5 min-w-0"
								/>
								<div className="flex flex-col flex-2 px-2 gap-2">
									<label
										htmlFor="type"
										className="text-sm font-bold"
									>
										Type
									</label>
									<div className="relative w-full">
										<select
											{...register("type")}
											className="border-[1px] w-full rounded-xl p-2 px-2 font-medium border-neutral-600 bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-accent transition duration-200 block appearance-none"
										>
											<option value="login">Login</option>
											<option value="identity">
												Identity
											</option>
										</select>
										<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-neutral-600">
											<LuChevronsUpDown />
										</div>
									</div>
								</div>
							</div>
							<LabeledInput
								label="notes"
								id="notes"
								{...register("notes")}
								error={errors.name?.message}
							/>
							<TagsField />
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
