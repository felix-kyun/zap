import { redirect, type LoaderFunctionArgs } from "react-router-dom";
import { checkAuthState } from "../services/auth.service";

export async function dashboardLoader({ request }: LoaderFunctionArgs) {
	const authenticated = await checkAuthState();

	if (!authenticated)
		throw redirect(
			"/login?from=" + encodeURIComponent(new URL(request.url).pathname),
		);
}
