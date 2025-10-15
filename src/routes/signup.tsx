import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { checkAuthState, signup } from "@services/auth.service";
import { LabeledInput } from "@components/LabeledInput";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import logo from "../assets/zap.png";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AccentButton } from "@components/AccentButton";
import { CenteredContainer } from "@components/CenteredContainer";

const signupSchema = z.object({
	username: z.string().min(1, "Username is required"),
	password: z.string().min(1, "Password must be at least 6 characters"),
	email: z.email("Invalid email address"),
});

type SignupFormData = z.infer<typeof signupSchema>;

export const Route = createFileRoute("/signup")({
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
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors, isSubmitting },
	} = useForm<SignupFormData>({
		resolver: zodResolver(signupSchema),
		delayError: 500,
	});

	const submitHandler = ({ username, email, password }: SignupFormData) => {
		toast.promise(signup({ username, email, password }), {
			loading: "Signing up...",
			success: () => {
				navigate({
					to: "/login",
					replace: true,
				});
				return "Signup successful! Please log in.";
			},
			error: (err) => {
				setValue("username", "");
				setValue("email", "");
				setValue("password", "");
				return `Signup failed: ${err.message}`;
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
						Welcome to <span className="text-accent">Zap</span>!
					</span>
				</div>
				<div className="flex flex-col gap-4">
					<LabeledInput
						id="username"
						label="Username"
						type="text"
						error={errors.email?.message}
						{...register("username")}
					/>
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
						{isSubmitting ? "Signing up..." : "Sign Up"}
					</AccentButton>
				</div>
				<div className="flex justify-center items-center">
					<span className="text-sm font-medium">
						Already have an account?{" "}
						<Link
							to="/login"
							className="text-accent font-bold hover:underline"
						>
							Login
						</Link>
					</span>
				</div>
			</CenteredContainer>
		</form>
	);
}
