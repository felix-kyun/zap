import { useCallback, useEffect, useRef } from "react";

type ThrottledFunction<T extends (...args: unknown[]) => unknown> = ((
	...args: Parameters<T>
) => ReturnType<T> | undefined) & { cancel: () => void };

export function useThrottle<T extends (...args: unknown[]) => unknown>(
	func: T,
	delay: number = 200,
): ThrottledFunction<T> {
	const functionRef = useRef<T>(func);
	useEffect(() => {
		functionRef.current = func;
	}, [func]);

	const isThrottled = useRef(false);
	const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
	const returnValue = useRef<ReturnType<T> | undefined>(undefined);

	const cancel = useCallback(() => {
		if (timer.current) {
			clearTimeout(timer.current);
			timer.current = null;
		}
		isThrottled.current = false;
		returnValue.current = undefined;
	}, []);

	const throttledFunction = useCallback(
		function (this: ThisParameterType<T>, ...functionArgs: Parameters<T>) {
			if (!isThrottled.current) {
				returnValue.current = functionRef.current.apply(
					this,
					functionArgs,
				) as ReturnType<T>;
				isThrottled.current = true;

				timer.current = setTimeout(() => {
					isThrottled.current = false;
					timer.current = null;
				}, delay);

				return returnValue.current;
			}

			return returnValue.current;
		},
		[delay],
	) as ThrottledFunction<T>;

	throttledFunction.cancel = cancel;

	useEffect(() => {
		return cancel;
	}, [cancel, func, delay]);

	return throttledFunction;
}
