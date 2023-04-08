import {
    ActionIcon,
    MantineColor,
    MantineNumberSize,
    Tooltip,
    Variants,
} from "@mantine/core";
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
    color?: MantineColor;
    size?: MantineNumberSize;
}

export default ({
    children,
    onClick,
    tip,
    variant,
    color,
    size,
}: TippedActionIconProps) => {
    return (
        <Tooltip label={tip} withArrow openDelay={1000} hidden={!tip}>
            <ActionIcon
                variant={variant}
                color={color}
                onClick={onClick}
                size={size}
            >
                {children}
            </ActionIcon>
        </Tooltip>
    );
};
