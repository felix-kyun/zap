import { Outlet } from "react-router-dom";

export function Root() {
	return (
		<>
			<nav>Zap</nav>
			<main>
				<Outlet />
			</main>
		</>
	);
}
