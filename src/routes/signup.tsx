import { AccentButton } from "@components/AccentButton";
import { CenteredContainer } from "@components/CenteredContainer";
import { LabeledInput } from "@components/LabeledInput";
import { OtpComponent } from "@components/OtpComponent";
import { zodResolver } from "@hookform/resolvers/zod";
import { Auth } from "@services/auth";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import z from "zod";

import logo from "@/assets/zap.png";
import type { Nullable } from "@/types/utils";

const signupSchema = z.object({
	username: z.string().min(1, "Username is required"),
	password: z.string().min(1, "Password must be at least 6 characters"),
	email: z.email("Invalid email address"),
});

type SignupFormData = z.infer<typeof signupSchema>;

export const Route = createFileRoute("/signup")({
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
	const [showOtp, setShowOtp] = useState(false);
	const registrationDataRef = useRef<Nullable<string>>(null);

	const {
		register,
		handleSubmit,
		setValue,
		getValues,
		setFocus,
		formState: { errors, isSubmitting },
	} = useForm<SignupFormData>({
		resolver: zodResolver(signupSchema),
		delayError: 500,
	});

	useEffect(() => {
		if (!showOtp) {
			setFocus("username");
		}
	}, [showOtp, setFocus]);

	const submitHandler = async ({ email, password }: SignupFormData) => {
		toast.loading("Initiating signup...", {
			id: "signup",
			duration: Infinity,
		});

		try {
			const data = await Auth.startSignup({ email, password });
			registrationDataRef.current = data;
			setShowOtp(true);
			toast.success("OTP sent to your email.", {
				id: "signup",
				duration: 5000,
			});
		} catch (err: unknown) {
			setShowOtp(false);
			setValue("password", "");
			setValue("email", "");
			setValue("username", "");
			toast.error(
				"Signup initiation failed: " +
					(err instanceof Error ? err.message : "Unknown error"),
				{ id: "signup", duration: 5000 },
			);
			return;
		}
	};

	const finalizeSignup = async (otp: string) => {
		if (!registrationDataRef.current) {
			toast.error(
				"Registration data missing. Please try signing up again.",
			);
			setShowOtp(false);
			return;
		}

		toast.promise(
			Auth.finishSignup(
				{
					email: getValues("email"),
					password: getValues("password"),
					username: getValues("username"),
					otp,
				},
				registrationDataRef.current,
			),
			{
				loading: "Signing up...",
				success: () => {
					navigate({
						to: "/login",
						replace: true,
					});
					return "Signup successful! Please log in.";
				},
				error: (err) => {
					setShowOtp(false);
					setValue("password", "");
					setValue("email", "");
					setValue("username", "");
					return `Signup failed: ${
						err instanceof Error ? err.message : "Unknown error"
					}`;
				},
			},
		);
	};

	return (
		<CenteredContainer>
			{!showOtp && (
				<form
					onSubmit={handleSubmit(submitHandler)}
					action="javascript:void(0)"
					className="flex flex-col gap-8"
				>
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
							error={errors.username?.message}
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
				</form>
			)}
			{showOtp && <OtpComponent onSubmit={finalizeSignup} />}
		</CenteredContainer>
	);
}
