import type { LoginItem, VaultItem } from "@/types/vault";
import { getFaviconUrl } from "@utils/extractHostname";
import { FieldRow, SensetiveFieldRow } from "./FieldRow";

type LoginItemViewProps = {
    item: VaultItem;
};

export function LoginItemView({ item }: LoginItemViewProps) {
    const { username, password, url, tags, name } = item as LoginItem;

    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-4 justify-start items-center">
                <div className="aspect-square h-full max-h-12 rounded-lg bg-white p-1.5 shadow flex items-center justify-center">
                    <img
                        src={getFaviconUrl(url)}
                        alt={"Favicon"}
                        className="bg-white object-cover"
                    />
                </div>
                <div className="flex flex-col gap-1 justify-between">
                    <span className="font-bold text-2xl">{name}</span>
                </div>
            </div>
            {tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                    {tags.map(({ value }) => (
                        <span
                            className="rounded-xl bg-accent text-sm py-1 px-2 font-medium"
                            key={value}
                        >
                            {value}
                        </span>
                    ))}
                </div>
            )}
            <FieldRow label="URL" value={url} />
            <FieldRow label="Username" value={username} />
            <SensetiveFieldRow label="Password" value={password} />
        </div>
    );
}
