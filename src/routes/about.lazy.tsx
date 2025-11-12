import { createLazyFileRoute } from "@tanstack/react-router";

import logo from "@/assets/zap.png";

export const Route = createLazyFileRoute("/about")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="flex flex-col items-center justify-center flex-1">
			<div className="bg-black rounded-2xl p-3 flex items-center justify-center mb-4 shadow-xl">
				<img src={logo} alt="Logo" className="h-32 w-32" />
			</div>
			<h1 className="text-4xl font-bold text-gray-800">Zap</h1>
		</div>
	);
}
