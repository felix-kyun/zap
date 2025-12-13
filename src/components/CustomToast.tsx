import { Toaster } from "react-hot-toast";

export function CustomToast() {
	return (
		<Toaster
			position="top-center"
			toastOptions={{
				duration: 2000,
				style: {
					border: "1px solid oklch(0.27 0 0)",
					borderRadius: "12px",
					background: "oklch(0.14 0 0)",
					color: "oklch(0.92 0 0)",
					borderWidth: 1,
				},
			}}
		/>
	);
}
