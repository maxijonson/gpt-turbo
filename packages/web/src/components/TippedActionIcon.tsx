import { ActionIcon, Tooltip, Variants } from "@mantine/core";
import { MouseEventHandler } from "react";

interface TippedActionIconProps {
    children?: React.ReactNode;
    onClick?: MouseEventHandler<HTMLButtonElement>;
    tip?: string;
    variant?: Variants<
        | "subtle"
        | "filled"
        | "outline"
        | "light"
        | "default"
        | "transparent"
        | "gradient"
    >;
}

export default ({ children, onClick, tip, variant }: TippedActionIconProps) => {
    return (
        <Tooltip label={tip} withArrow openDelay={1000} hidden={!tip}>
            <ActionIcon variant={variant} color="gray" onClick={onClick}>
                {children}
            </ActionIcon>
        </Tooltip>
    );
};
