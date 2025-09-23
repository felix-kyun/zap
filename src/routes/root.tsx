import { Outlet } from "react-router-dom";

export function Root() {
	return (
		<>
			<nav>Root</nav>
			<main>
				<Outlet />
			</main>
		</>
	);
}
