import FallbackIcon from "@/assets/fallback-icon.png";

function extractHostname(url: string): string {
	try {
		const parsedUrl = new URL(url);
		return parsedUrl.hostname;
	} catch {
		return "";
	}
}

export function getFaviconUrl(url: string) {
	const hostname = extractHostname(url);
	if (hostname)
		return `https://www.google.com/s2/favicons?sz=64&domain=${hostname}`;
	return FallbackIcon;
}
