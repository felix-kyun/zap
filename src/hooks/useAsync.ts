import { useCallback, useState } from "react";

export type AsyncState<T> =
	| { status: "idle" | "loading"; data: undefined; error: undefined }
	| { status: "error"; data: undefined; error: Error }
	| { status: "success"; data: T; error: undefined };

export function useAsync<T, U extends unknown[]>(
	asyncFn: (...args: U) => Promise<T>,
) {
	const [state, setState] = useState<AsyncState<T>>({
		status: "idle",
		data: undefined,
		error: undefined,
	});

	const run = useCallback(
		async (...args: U) => {
			setState({ status: "loading", data: undefined, error: undefined });
			try {
				const data = await asyncFn(...args);
				setState({ status: "success", data, error: undefined });
				return data;
			} catch (error: unknown) {
				setState({
					status: "error",
					data: undefined,
					error:
						error instanceof Error
							? error
							: new Error(String(error)),
				});
				throw error;
			}
		},
		[asyncFn],
	);

	return { ...state, run };
}
