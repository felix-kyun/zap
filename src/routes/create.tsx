import { createFileRoute, redirect } from "@tanstack/react-router";
import { createInitialVault } from "@services/vault.service";
import { useStore } from "@stores/store";
import toast from "react-hot-toast";
import { checkAuthState } from "@services/auth.service";
import { fetchVault } from "@services/server.service";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@components/Modal";
import { LabeledPasswordInput } from "@components/LabeledPasswordInput";

const vaultPasswordSchema = z.object({
	password: z.string().min(1, "Password is required"),
});

type VaultPasswordFormData = z.infer<typeof vaultPasswordSchema>;

export const Route = createFileRoute("/create")({
	component: RouteComponent,
	beforeLoad: async () => {
		const authenticated = await checkAuthState();

		if (!authenticated)
			throw redirect({
				to: "/login",
			});

		try {
			const fetchedVault = await fetchVault();

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
	loader: () => createInitialVault(),
});

function RouteComponent() {
	const navigate = Route.useNavigate();
	const newVault = Route.useLoaderData();
	const setInitialVautl = useStore((state) => state.setInitialVault);
	const saveVault = useStore((state) => state.saveVault);
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<VaultPasswordFormData>({
		resolver: zodResolver(vaultPasswordSchema),
		delayError: 500,
	});

	const submitHandler = ({ password }: VaultPasswordFormData) => {
		toast.promise(
			async () => {
				await setInitialVautl(newVault, password);
				await saveVault();
			},
			{
				loading: "Creating vault...",
				success: () => {
					navigate({
						to: "/dashboard",
						from: "/create",
					});
					return "Vault created!";
				},
				error: (err) => `Error: ${err.message}`,
			},
		);
	};

	return (
		<form onSubmit={handleSubmit(submitHandler)}>
			<Modal
				open={true}
				close={() => {}}
				disableClose={true}
				title=""
				containerClassName="!max-w-md"
			>
				<div className="flex flex-col items-center">
					<LabeledPasswordInput
						id="password"
						label="New Master Password"
						error={errors.password?.message}
						{...register("password")}
					/>
					<button
						className="bg-accent text-text p-2 rounded-xl w-full font-medium mt-2"
						disabled={isSubmitting}
					>
						{isSubmitting ? "Creating..." : "Create"}
					</button>
				</div>
			</Modal>
		</form>
	);
}
