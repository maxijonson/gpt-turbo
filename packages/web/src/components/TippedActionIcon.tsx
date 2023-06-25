import { ActionIcon, ActionIconProps, Tooltip } from "@mantine/core";
import { FloatingPosition } from "@mantine/core/lib/Floating";

interface TippedActionIconBaseProps {
    tip?: string;
    tipPosition?: FloatingPosition;
}

type TippedActionIconActionIconProps<C = "button"> =
    import("@mantine/utils").PolymorphicComponentProps<C, ActionIconProps>;

type TippedActionIconProps<C = "button"> = TippedActionIconBaseProps &
    TippedActionIconActionIconProps<C>;

const TippedActionIcon = <C = "button",>({
    tip,
    tipPosition,
    ...actionIconProps
}: TippedActionIconProps<C>) => {
    return (
        <Tooltip
            label={tip}
            withArrow
            openDelay={1000}
            hidden={!tip}
            position={tipPosition}
        >
            <ActionIcon {...actionIconProps} />
        </Tooltip>
    );
};

export default TippedActionIcon;
