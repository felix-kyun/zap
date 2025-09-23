import { createBrowserRouter } from "react-router-dom";
import { Root } from "./root";
import { dashboardLoader } from "../loaders/dashboard.loader";
import { ErrorRoute } from "./error.route";
import { Login } from "./login.route";
import { Signup } from "./signup.route";
import { Dashboard } from "./dashboard";

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
