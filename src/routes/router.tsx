import { createBrowserRouter } from "react-router-dom";
import { Root } from "./root";
import { dashboardLoader } from "@loaders/dashboard.loader";
import { ErrorRoute } from "@routes/error.route";
import { Login } from "@routes/login.route";
import { Signup } from "@routes/signup.route";
import { Dashboard } from "@routes/dashboard";

export const router = createBrowserRouter([
	{
		path: "/",
		element: <Root />,
		errorElement: <ErrorRoute />,
		children: [
			{
				index: true,
				element: <Dashboard />,
				errorElement: <ErrorRoute />,
				loader: dashboardLoader,
				HydrateFallback: () => <div>Loading...</div>,
			},
			{
				path: "/login",
				element: <Login />,
			},
			{
				path: "/signup",
				element: <Signup />,
			},
		],
	},
]);
