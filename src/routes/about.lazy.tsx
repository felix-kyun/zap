import { createLazyFileRoute } from "@tanstack/react-router";

import logo from "@/assets/zap.png";

export const Route = createLazyFileRoute("/about")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="flex flex-col items-center justify-center flex-1 h-dvh">
			<div className="flex items-center justify-center py-4 px-6 bg-accent/20 border-accent border-2 rounded-3xl">
				<img src={logo} alt="Logo" className="h-32 w-32" />
			</div>
			<h1 className="text-4xl font-bold mt-6">
				Zap
				<span className="text-accent font-extrabold">!</span>
			</h1>
		</div>
	);
}
