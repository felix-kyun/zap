import { EditButton } from "@components/EditButton";
import { Modal } from "@components/Modal";
import { FcSimCardChip } from "react-icons/fc";
import { RiVisaLine } from "react-icons/ri";

import type { CardItem } from "@/types/vault";

type CardItemViewProps = {
	item: CardItem;
	open: boolean;
	close: () => void;
};

export function CardItemView({ item, open, close }: CardItemViewProps) {
	const { cardNumber, cardHolder, cardExpiry, cardCVV } = item;

	return (
		<Modal
			open={open}
			close={close}
			title="Card Details"
			options={<EditButton />}
		>
			<div className="flex flex-col gap-4 bg-accent rounded-xl aspect-video">
				<div className="flex flex-col justify-between items-start h-full p-6">
					<span className="flex justify-between items-center w-full text-6xl">
						<FcSimCardChip />
						<RiVisaLine />
					</span>
					<span className="font-mono text-2xl tracking-widest">
						{cardNumber.replace(/(.{4})/g, "$1 ")}
					</span>
					<div className="flex justify-between items-center w-full">
						<span className="flex flex-col">
							<span className="text-xs text-text-secondary">
								Card Holder
							</span>
							<span className="font-bold text-lg">
								{cardHolder.toUpperCase()}
							</span>
						</span>
						<span className="flex flex-col">
							<span className="text-xs text-text-secondary">
								Expires
							</span>
							<span className="font-bold text-lg">
								{cardExpiry}
							</span>
						</span>
						<span className="flex flex-col">
							<span className="text-xs text-text-secondary">
								CVV
							</span>
							<span className="font-bold text-lg">{cardCVV}</span>
						</span>
					</div>
				</div>
			</div>
		</Modal>
	);
}
