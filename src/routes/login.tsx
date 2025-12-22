import { AccentButton } from "@components/AccentButton";
import { CenteredContainer } from "@components/CenteredContainer";
import { GoogleLoginButton } from "@components/GoogleLoginButton";
import { LabeledInput } from "@components/LabeledInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { Auth } from "@services/auth.service";
import { useStore } from "@stores/store";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import z from "zod";

const loginSchema = z.object({
	email: z.email("Invalid email address"),
	password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const Route = createFileRoute("/login")({
	component: RouteComponent,
	loader: async () => {
		const authenticated = await Auth.checkAuthState();
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
		setFocus,
		formState: { isSubmitting, errors },
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
		delayError: 500,
	});

	useEffect(() => {
		setFocus("email");
	}, [setFocus]);

	// TODO: make login async using worker
	// add loading state
	const submitHandler = async ({ email, password }: LoginFormData) => {
		toast.promise(Auth.login({ email, password }), {
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
				if (error instanceof Error) return error.message;
				return "Login failed. Please try again.";
			},
		});
	};

	return (
		<CenteredContainer>
			<form
				onSubmit={handleSubmit(submitHandler)}
				action="javascript:void(0)"
				className="flex flex-col gap-4"
			>
				<span className="flex justify-center font-semibold text-2xl">
					Welcome Back
				</span>
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
				<div className="flex flex-col gap-4 mt-4">
					<AccentButton disabled={isSubmitting}>
						{isSubmitting ? "Logging in..." : "Login"}
					</AccentButton>
					<GoogleLoginButton
						onSuccess={() => navigate({ to: "/", replace: true })}
					/>
				</div>
				<div className="flex justify-center items-center">
					<span className="text-sm">
						First time here?{" "}
						<Link to="/signup" className="text-accent font-bold">
							Register Now
						</Link>
					</span>
				</div>
			</form>
		</CenteredContainer>
	);
}
