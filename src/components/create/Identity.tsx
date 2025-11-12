import { LabeledInput } from "@components/LabeledInput";
import { useFormContext } from "react-hook-form";

import type { IdentityItem } from "@/types/vault";

export function CreateIdentityItem() {
	const {
		register,
		formState: { errors },
	} = useFormContext<IdentityItem>();

	return (
		<>
			<LabeledInput
				label="Full Name"
				id="fullname"
				placeholder="https://example.com"
				{...register("fullName")}
				error={errors.fullName?.message}
			/>
			<LabeledInput
				label="Email"
				id="email"
				placeholder=""
				{...register("email")}
				error={errors.email?.message}
			/>
			<LabeledInput
				label="Phone"
				id="phone"
				placeholder=""
				{...register("phoneNumber")}
				error={errors.phoneNumber?.message}
			/>
			<LabeledInput
				label="Address"
				id="address"
				placeholder=""
				{...register("address")}
				error={errors.address?.message}
			/>
			<LabeledInput
				label="Date of Birth"
				id="dob"
				placeholder="DD/MM/YYYY"
				{...register("dateOfBirth")}
				error={errors.dateOfBirth?.message}
			/>
		</>
	);
}
