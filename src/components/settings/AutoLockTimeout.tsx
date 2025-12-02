import { LabeledDropdown } from "@components/LabeledDropdown";
import { useStore } from "@stores/store";
import { useMemo } from "react";

const map = {
	"1 Minute": 1 * 60 * 1000,
	"5 Minutes": 5 * 60 * 1000,
	"10 Minutes": 10 * 60 * 1000,
	"30 Minutes": 30 * 60 * 1000,
};

type ValidOption = keyof typeof map;

export function AutoLockTimeout() {
	const updateSettings = useStore((state) => state.updateSettings);
	const autoLockTimeout = useStore(
		(state) => state.vault?.settings.autoLockTimeout,
	);

	// wont happen but safety
	if (autoLockTimeout === undefined) {
		return null;
	}

	const options = useMemo<ValidOption[]>(() => {
		return Object.keys(map) as ValidOption[];
	}, []);

	const handleChange = (value: ValidOption) => {
		const timeout = map[value];
		updateSettings({ autoLockTimeout: timeout });
	};

	const value = useMemo<ValidOption>(() => {
		const entry = Object.entries(map).find(
			([, v]) => v === autoLockTimeout,
		);
		return (entry ? entry[0] : "5 Minutes") as ValidOption;
	}, [autoLockTimeout]);

	return (
		<div className="flex justify-between items-center">
			<label className="text-lg font-semibold">
				Auto Lock Vault Timeout
			</label>
			<div className="w-40">
				<LabeledDropdown
					label=""
					options={options}
					value={value}
					onChange={handleChange}
				/>
			</div>
		</div>
	);
}
