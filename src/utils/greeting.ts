export const greeting = (name: string): string => {
	const hour = new Date().getHours();

	if (hour < 5) return `🌙 Working late, ${name}?`;
	else if (hour < 12) return `☕️ Good morning, ${name}!`;
	else if (hour < 18) return `☀️ Good afternoon, ${name}!`;
	else return `🌇 Good evening, ${name}!`;
};
