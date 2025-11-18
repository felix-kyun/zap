import { Modal } from "@components/Modal";

type SettingsProps = {
	open: boolean;
	close: () => void;
};

export function Settings({ open, close }: SettingsProps) {
	return (
		<Modal open={open} close={close} title="Settings">
			<div className="flex flex-col gap-4">
				<div>
					<h2 className="text-lg font-semibold">User Settings</h2>
					<p className="text-sm text-muted-foreground">
						Manage your account and preferences.
					</p>
				</div>
				<div>
					<h2 className="text-lg font-semibold">
						Application Settings
					</h2>
					<p className="text-sm text-muted-foreground">
						Configure application behavior and appearance.
					</p>
				</div>
			</div>
		</Modal>
	);
}
