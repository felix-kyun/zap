import { useCallback, useState, type ComponentProps } from "react";
import { LuCopy, LuEye, LuEyeOff } from "react-icons/lu";
import * as motion from "motion/react-client";
import { AnimatePresence } from "motion/react";
import clsx from "clsx";
import toast from "react-hot-toast";

type CopyValueButtonProps = {
    value: string;
    className?: string;
};

export function CopyValueButton({ value, className }: CopyValueButtonProps) {
    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(value);
        toast.success("Copied to clipboard");
    }, [value]);

    return (
        <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className={`text-text-secondary px-3 w-min text-xl hover:text-text cursor-pointer ${className}`}
            onClick={handleCopy}
        >
            <LuCopy />
        </motion.button>
    );
}

type FieldRowProps = {
    label: string;
    value: string;
};
export function FieldRow({ label, value }: FieldRowProps) {
    return (
        <div className="flex w-full justify-between items-center">
            <div className="flex flex-col">
                <span className="text-xs text-text-secondary">{label}</span>
                <span className="text-lg">{value}</span>
            </div>
            <CopyValueButton value={value} />
        </div>
    );
}

export function SensetiveFieldRow({ label, value }: FieldRowProps) {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div className="flex w-full justify-between items-center">
            <div className="flex flex-col">
                <span className="text-xs text-text-secondary">{label}</span>
                <div className="flex items-center gap-2">
                    <span className="text-lg">
                        {isVisible ? value : "••••••••"}
                    </span>
                    <PasswordVisibilityToggle
                        isVisible={isVisible}
                        onClick={() => setIsVisible(!isVisible)}
                    />
                </div>
            </div>
            <CopyValueButton value={value} />
        </div>
    );
}

type PasswordVisibilityToggleProps = ComponentProps<typeof motion.button> & {
    isVisible: boolean;
};
function PasswordVisibilityToggle({
    isVisible,
    ...props
}: PasswordVisibilityToggleProps) {
    return (
        <motion.button
            type="button"
            className={clsx([
                "text-xl",
                "text-text-secondary hover:text-text cursor-pointer",
            ])}
            tabIndex={-1}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.075 }}
            {...props}
        >
            <AnimatePresence mode="wait">
                {isVisible ? (
                    <motion.span
                        key="eye-off"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.18 }}
                    >
                        <LuEyeOff />
                    </motion.span>
                ) : (
                    <motion.span
                        key="eye"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.18 }}
                    >
                        <LuEye />
                    </motion.span>
                )}
            </AnimatePresence>
        </motion.button>
    );
}
