export function cardType(cardNumber: string): string {
    if (isVisa(cardNumber)) {
        return "Visa";
    } else if (isMasterCard(cardNumber)) {
        return "MasterCard";
    }

    return "Unknown";
}

function isVisa(cardNumber: string): boolean {
    const regex = /^4[0-9]{12}(?:[0-9]{3})?(?:[0-9]{3})?$/;

    return regex.test(cardNumber);
}

function isMasterCard(cardNumber: string): boolean {
    const regex =
        /^(5[1-5][0-9]{14}|2(2(2[1-9]|[3-9][0-9])|[3-6][0-9]{2}|7([0-1][0-9]|20))[0-9]{12})$/;

    return regex.test(cardNumber);
}
