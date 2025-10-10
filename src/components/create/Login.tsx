import type { LoginItem } from "@/types/vault";
import { LabeledInput } from "@components/LabeledInput";
import { useFormContext } from "react-hook-form";

export function CreateLoginItem() {
	const {
		register,
		formState: { errors },
	} = useFormContext<LoginItem>();

	return (
		<>
			<LabeledInput
				label="Url"
				id="url"
				placeholder="https://example.com"
				{...register("url")}
				error={errors.url?.message}
			/>
			<LabeledInput
				label="Username"
				id="username"
				{...register("username")}
				error={errors.username?.message}
			/>
			<LabeledInput
				label="password"
				id="password"
				type="password"
				{...register("password")}
				error={errors.password?.message}
			/>
		</>
	);
}
