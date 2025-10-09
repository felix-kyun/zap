import toast from "react-hot-toast";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { checkAuthState, login } from "@services/auth.service";
import { useStore } from "@stores/store";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import logo from "../assets/zap.png";
import { LabeledInput } from "@components/LabeledInput";

const loginSchema = z.object({
	email: z.email("Invalid email address"),
	password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const Route = createFileRoute("/login")({
	component: RouteComponent,
	loader: async () => {
		const authenticated = await checkAuthState();
		if (authenticated) {
			toast("You're already logged in.");
			throw redirect({
				to: "/",
				replace: true,
			});
		}
	},
});

function RouteComponent() {
	const navigate = Route.useNavigate();
	const setUser = useStore((state) => state.setUser);
	const {
		register,
		handleSubmit,
		setValue,
		formState: { isSubmitting, errors },
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
		delayError: 500,
	});

	// TODO: make login async using worker
	// add loading state
	const submitHandler = async ({ email, password }: LoginFormData) => {
		toast.promise(login({ email, password }), {
			loading: "Logging in...",
			success: (data) => {
				setUser(data);
				navigate({
					to: "/",
					replace: true,
				});

				return "Login successful!";
			},
			error: () => {
				setValue("password", "");
				return "Login failed, please check your credentials and try again.";
			},
		});
	};

	return (
		<form onSubmit={handleSubmit(submitHandler)}>
			<div className="container mx-auto min-h-screen flex items-center justify-center text-xl font-[Karla] px-4">
				<div className="flex flex-col gap-8 w-full max-w-lg pb-10 pt-6 px-14 rounded-xl sm:border-[1px] border-border">
					<div className="flex flex-col justify-center items-center gap-2">
						<img src={logo} alt="Zap Logo" className="h-24" />
						<span className="font-bold text-3xl">
							Welcome Back to{" "}
							<span className="text-accent">Zap</span>!
						</span>
					</div>
					<div className="flex flex-col gap-1">
						<LabeledInput
							id="email"
							label="Email address"
							{...register("email")}
						/>
						<LabeledInput
							id="password"
							label="Password"
							type="password"
							{...register("password")}
						/>
						<button
							className="bg-accent text-text p-2 mt-4 rounded-xl w-full font-medium"
							disabled={isSubmitting}
						>
							{isSubmitting ? "Logging in..." : "Login"}
						</button>
					</div>

					<div className="flex justify-center items-center">
						<span className="text-sm font-medium">
							Don't have an account?{" "}
							<a href="/signup" className="text-accent">
								Register
							</a>
						</span>
					</div>
				</div>
			</div>
		</form>
	);
}
