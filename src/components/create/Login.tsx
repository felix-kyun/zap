import { LabeledInput } from "@components/LabeledInput";
import { LabeledPasswordInput } from "@components/LabeledPasswordInput";
import { useFormContext } from "react-hook-form";

import type { LoginItem } from "@/types/vault";

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
			<LabeledPasswordInput
				label="Password"
				id="password"
				{...register("password")}
				error={errors.password?.message}
			/>
		</>
	);
}
