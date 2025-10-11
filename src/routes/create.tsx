import { createFileRoute, redirect } from "@tanstack/react-router";
import { LabeledInput } from "@components/LabeledInput";
import { createInitialVault } from "@services/vault.service";
import { useStore } from "@stores/store";
import toast from "react-hot-toast";
import logo from "../assets/zap.png";
import { checkAuthState } from "@services/auth.service";
import { fetchVault } from "@services/server.service";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import * as motion from "motion/react-client";

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
	const setKeyFromPassword = useStore((state) => state.setKeyFromPassword);
	const setVault = useStore((state) => state.setVault);
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
				setVault(newVault);
				await setKeyFromPassword(password);
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
			<div className="container mx-auto min-h-screen flex items-center justify-center text-xl font-[Karla] px-4">
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					exit={{ opacity: 0, scale: 0.95 }}
					transition={{ duration: 0.15, delay: 0.25 }}
					className="flex flex-col gap-2 w-full max-w-lg pb-10 py-8 px-14 rounded-xl sm:border-[1px] border-border"
				>
					<div className="flex flex-col justify-center items-center mb-4">
						<img src={logo} alt="Zap Logo" className="h-24" />
					</div>
					<LabeledInput
						id="password"
						label="Create Master Password"
						type="password"
						error={errors.password?.message}
						{...register("password")}
					/>
					<button
						className="bg-accent text-text p-2 rounded-xl w-full font-medium"
						disabled={isSubmitting}
					>
						{isSubmitting ? "Creating..." : "Create"}
					</button>
				</motion.div>
			</div>
		</form>
	);
}
