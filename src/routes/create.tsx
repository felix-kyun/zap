import { AccentButton } from "@components/AccentButton";
import { LabeledPasswordInput } from "@components/LabeledPasswordInput";
import { Modal } from "@components/Modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { Auth } from "@services/auth";
import { Server } from "@services/server";
import { useStore } from "@stores/store";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import z from "zod";

const vaultPasswordSchema = z.object({
	password: z.string().min(1, "Password is required"),
});

type VaultPasswordFormData = z.infer<typeof vaultPasswordSchema>;

export const Route = createFileRoute("/create")({
	component: RouteComponent,
	beforeLoad: async () => {
		const authenticated = await Auth.checkAuthState();

		if (!authenticated)
			throw redirect({
				to: "/login",
			});

		try {
			const fetchedVault = await Server.fetchVault();

			if (fetchedVault) {
				toast.error("Vault already exists, redirecting to dashboard.");
				throw redirect({
					to: "/dashboard",
				});
			}
		} catch {
			return;
		}
	},
});

function RouteComponent() {
	const navigate = Route.useNavigate();
	const createInitialVault = useStore((state) => state.createInitialVault);
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		setFocus,
	} = useForm<VaultPasswordFormData>({
		resolver: zodResolver(vaultPasswordSchema),
		delayError: 500,
	});

	useEffect(() => {
		setFocus("password");
	}, [setFocus]);

	const submitHandler = ({ password }: VaultPasswordFormData) => {
		toast.promise(() => createInitialVault(password), {
			loading: "Creating vault...",
			success: () => {
				navigate({
					to: "/dashboard",
					from: "/create",
				});
				return "Vault created!";
			},
			error: (err) => `Error: ${err.message}`,
		});
	};

	return (
		<Modal
			open={true}
			close={() => {}}
			disableClose={true}
			title=""
			containerClassName="!max-w-md"
		>
			<form onSubmit={handleSubmit(submitHandler)}>
				<div className="flex flex-col items-center">
					<LabeledPasswordInput
						id="password"
						label="New Master Password"
						error={errors.password?.message}
						{...register("password")}
					/>
					<AccentButton disabled={isSubmitting} type="submit">
						{isSubmitting ? "Creating..." : "Create"}
					</AccentButton>
				</div>
			</form>
		</Modal>
	);
}
