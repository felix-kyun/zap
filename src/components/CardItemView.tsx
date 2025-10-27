import type { CardItem } from "@/types/vault";
import { FcSimCardChip } from "react-icons/fc";
import { RiVisaLine } from "react-icons/ri";

type CardItemViewProps = {
    item: CardItem;
};

export function CardItemView({ item }: CardItemViewProps) {
    const { cardNumber, cardHolder, cardExpiry, cardCVV } = item;

    return (
        <div className="flex flex-col gap-4 bg-accent m-7 mt-10 rounded-xl aspect-video">
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
                        <span className="font-bold text-lg">{cardExpiry}</span>
                    </span>
                    <span className="flex flex-col">
                        <span className="text-xs text-text-secondary">CVV</span>
                        <span className="font-bold text-lg">{cardCVV}</span>
                    </span>
                </div>
            </div>
        </div>
    );
}
