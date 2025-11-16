import { type ComponentType, useCallback, useState } from "react";

type UseModalProps = {
	onOpen?: () => void;
	onClose?: () => void;
};

type RequiredModalProps = {
	open: boolean;
	close: () => void;
};

export function useModal(
	Modal: ComponentType<RequiredModalProps>,
	{ onOpen, onClose }: UseModalProps = {},
) {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const open = useCallback(() => {
		setIsOpen(true);
		if (onOpen) onOpen();
	}, [onOpen]);

	const close = useCallback(() => {
		setIsOpen(false);
		if (onClose) onClose();
	}, [onClose]);

	const toggle = useCallback(() => {
		setIsOpen((prev) => {
			const newState = !prev;
			if (newState && onOpen) onOpen();
			if (!newState && onClose) onClose();
			return newState;
		});
	}, [onOpen, onClose]);

	return [
		<Modal open={isOpen} close={close} />,
		{ isOpen, open, close, toggle },
	] as const;
}
