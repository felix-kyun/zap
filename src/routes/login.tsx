import toast from "react-hot-toast";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { checkAuthState, login } from "@services/auth.service";
import { useStore } from "@stores/store";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import logo from "../assets/zap.png";
import { LabeledInput } from "@components/LabeledInput";
import { AccentButton } from "@components/AccentButton";
import * as motion from "motion/react-client";
import { CenteredContainer } from "@components/CenteredContainer";

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
		console.log("submitting", { email, password });
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
			error: (error) => {
				setValue("password", "");
				return "Login failed: " + (error?.message || "Unknown error");
			},
		});
	};

	return (
		<form
			onSubmit={handleSubmit(submitHandler)}
			action="javascript:void(0)"
		>
			<CenteredContainer>
				<div className="flex flex-col justify-center items-center gap-2">
					<img src={logo} alt="Zap Logo" className="h-24" />
					<span className="font-bold text-3xl">
						Welcome Back to <span className="text-accent">Zap</span>
						!
					</span>
				</div>
				<div className="flex flex-col gap-4">
					<LabeledInput
						id="email"
						label="Email address"
						type="email"
						error={errors.email?.message}
						{...register("email")}
					/>
					<LabeledInput
						id="password"
						label="Password"
						type="password"
						error={errors.password?.message}
						{...register("password")}
					/>
					<AccentButton className="mt-4" disabled={isSubmitting}>
						{isSubmitting ? "Logging in..." : "Login"}
					</AccentButton>
				</div>

				<div className="flex justify-center items-center">
					<span className="text-sm font-medium">
						Don't have an account?{" "}
						<Link
							to="/signup"
							className="text-accent font-bold hover:underline"
						>
							Register
						</Link>
					</span>
				</div>
			</CenteredContainer>
		</form>
	);
}
