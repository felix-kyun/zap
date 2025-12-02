import { Modal } from "@components/Modal";
import { AutoLockTimeout } from "./settings/AutoLockTimeout";

type SettingsProps = {
	open: boolean;
	close: () => void;
};

export function Settings({ open, close }: SettingsProps) {
	return (
		<Modal open={open} close={close} title="Settings">
			<div className="flex flex-col gap-4">
				<AutoLockTimeout />
			</div>
		</Modal>
	);
}
