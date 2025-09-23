type LabeledInputProps = {
	label: string;
	name: string;
	id?: string;
	type?: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	required?: boolean;
};
export function LabeledInput({
	label,
	name,
	id,
	type = "text",
	value,
	onChange,
	required = false,
}: LabeledInputProps) {
	return (
		<div>
			<label htmlFor={id || name}>{label}:</label>
			<input
				type={type}
				id={id || name}
				name={name}
				value={value}
				onChange={onChange}
				required={required}
			/>
		</div>
	);
}
