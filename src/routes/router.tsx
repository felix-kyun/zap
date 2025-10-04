import { createBrowserRouter } from "react-router-dom";
import { Root } from "./root";
import { dashboardLoader } from "@loaders/dashboard.loader";
import { ErrorRoute } from "@routes/error.route";
import { Login } from "@routes/login.route";
import { Signup } from "@routes/signup.route";
import { Dashboard } from "@routes/dashboard";
import { UnlockRoute } from "./unlock.route";
import { CreateVaultRoute } from "./createVault.route";
import { vaultLoader } from "@loaders/vault.loader";
import { Loading } from "@components/Loading";

export const router = createBrowserRouter([
	{
		path: "/",
		element: <Root />,
		errorElement: <ErrorRoute />,
		HydrateFallback: () => <Loading />,
		children: [
			{
				index: true,
				element: <Dashboard />,
				errorElement: <ErrorRoute />,
				loader: dashboardLoader,
			},
			{
				path: "/login",
				element: <Login />,
			},
			{
				path: "/signup",
				element: <Signup />,
			},
			{
				path: "/unlock",
				element: <UnlockRoute />,
				loader: vaultLoader,
			},
			{
				path: "/init",
				element: <CreateVaultRoute />,
			},
		],
	},
]);
