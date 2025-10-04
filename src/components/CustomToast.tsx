import { Toaster } from "react-hot-toast";

export function CustomToast() {
	return (
		<Toaster
			position="top-right"
			toastOptions={{
				duration: 2000,
			}}
		/>
	);
}
