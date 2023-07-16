import { ActionIcon, ActionIconProps, Tooltip } from "@mantine/core";
import { FloatingPosition } from "@mantine/core/lib/Floating";

interface TippedActionIconBaseProps {
    tip?: string;
    tipPosition?: FloatingPosition;
    withinPortal?: boolean;
    delay?: number;
}

type TippedActionIconActionIconProps<C = "button"> =
    import("@mantine/utils").PolymorphicComponentProps<C, ActionIconProps>;

type TippedActionIconProps<C = "button"> = TippedActionIconBaseProps &
    TippedActionIconActionIconProps<C>;

const TippedActionIcon = <C = "button",>({
    tip,
    tipPosition,
    withinPortal,
    delay = 1000,
    ...actionIconProps
}: TippedActionIconProps<C>) => {
    return (
        <Tooltip
            label={tip}
            withArrow
            openDelay={delay}
            hidden={!tip}
            position={tipPosition}
            withinPortal={withinPortal}
        >
            <ActionIcon {...actionIconProps} />
        </Tooltip>
    );
};

export default TippedActionIcon;
