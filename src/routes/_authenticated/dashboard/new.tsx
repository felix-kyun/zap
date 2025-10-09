import { vaultItemSchema } from "@/schemas/vault";
import type { VaultItem } from "@/types/vault";
import { CreateLoginItem } from "@components/create/Login";
import { TagsField } from "@components/TagsField";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";

export const Route = createFileRoute("/_authenticated/dashboard/new")({
	component: RouteComponent,
});

function RouteComponent() {
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

	return (
		<FormProvider {...form}>
			<form
				onSubmit={handleSubmit(onSubmit, () =>
					toast.error("Please fix the errors in the form."),
				)}
			>
				<label htmlFor="name">
					Name:
					<input {...register("name")} placeholder="Name" />
					{errors.name && (
						<p className="error">{errors.name.message}</p>
					)}
				</label>

				<br />
				<label htmlFor="notes">
					Notes:
					<textarea {...register("notes")} placeholder="Notes" />
					{errors.notes && (
						<p className="error">{errors.notes.message}</p>
					)}
				</label>
				<br />
				<TagsField />
				<br />
				<label htmlFor="type">
					type:
					<select {...register("type")}>
						<option value="login">Login</option>
						<option value="identity">Identity</option>
					</select>
				</label>
				<br />
				{watch("type") === "login" && <CreateLoginItem />}
				<button
					type="submit"
					className="bg-gray-200 p-1 rounded-lg m-1"
					disabled={isSubmitting}
				>
					Create
				</button>
			</form>
		</FormProvider>
	);
}
