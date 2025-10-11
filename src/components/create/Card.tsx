import type { CardItem } from "@/types/vault";
import { LabeledInput } from "@components/LabeledInput";
import { LabeledPasswordInput } from "@components/LabeledPasswordInput";
import { useFormContext } from "react-hook-form";

export function CreateCardItem() {
	const {
		register,
		formState: { errors },
	} = useFormContext<CardItem>();

	return (
		<>
			<LabeledInput
				label="Holder Name"
				id="cardHolder"
				{...register("cardHolder")}
				error={errors.cardHolder?.message}
			/>
			<LabeledInput
				label="Card Number"
				id="cardNumber"
				{...register("cardNumber")}
				error={errors.cardNumber?.message}
			/>
			<div className="flex gap-4 w-full">
				<LabeledPasswordInput
					label="CVV"
					id="cardCVV"
					{...register("cardCVV")}
					error={errors.cardCVV?.message}
				/>
				<LabeledInput
					label="Expiry Date"
					id="cardExpiry"
					placeholder="MM/YY"
					{...register("cardExpiry")}
					error={errors.cardExpiry?.message}
				/>
			</div>
		</>
	);
}
