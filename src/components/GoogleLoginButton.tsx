import { useEffect } from "react";
import { AccentButton } from "./AccentButton";
import { Api } from "@services/api.service";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;

declare global {
	interface Window {
		google: any;
	}
}

type GoogleLoginButtonProps = {
	onSuccess?: () => void;
};

const initializeGoogle = (onSuccess?: () => void) => {
	if (!window.google || !GOOGLE_CLIENT_ID) return;

	window.google?.accounts?.id?.initialize({
		client_id: GOOGLE_CLIENT_ID,
		callback: async (response: { credential: string }) => {
			const idToken = response.credential;
			await Api.post("/api/oauth/google", {
				idToken,
			});
			onSuccess?.();
		},
	});

	window.google?.accounts?.id?.renderButton(
		document.getElementById("google-signin-button"),
		{
			style: "standard",
			size: "large",
			theme: "outline",
			width: 300,
			text: "signin_with",
		},
	);
};

export function GoogleLoginButton({ onSuccess }: GoogleLoginButtonProps) {
	useEffect(() => {
		if (window.google && window.google.accounts) {
			initializeGoogle(onSuccess);
			return;
		}
		// Load script
		const script = document.createElement("script");
		script.src = "https://accounts.google.com/gsi/client";
		script.async = true;
		script.defer = true;
		script.onload = () => {
			initializeGoogle(onSuccess);
		};
		document.body.appendChild(script);

		return () => {
			document.body.removeChild(script);
		};
	}, []);

	return (
		<>
			<div id="google-signin-button" className="hidden absolute"></div>
			<AccentButton
				onClick={() => {
					const button = document.querySelector(
						"#google-signin-button div[role=button]",
					) as HTMLElement;

					button?.click();
				}}
				className="bg-prompt text-text border border-border-secondary"
				type="button"
			>
				Continue with Google
			</AccentButton>
		</>
	);
}
