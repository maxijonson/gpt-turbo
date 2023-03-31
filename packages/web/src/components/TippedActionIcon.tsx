import { ActionIcon, Tooltip } from "@mantine/core";

interface TippedActionIconProps {
    children?: React.ReactNode;
    onClick?: () => void;
    tip?: string;
}

export default ({ children, onClick, tip }: TippedActionIconProps) => {
    return (
        <Tooltip label={tip} withArrow openDelay={1000}>
            <ActionIcon variant="outline" color="gray" onClick={onClick}>
                {children}
            </ActionIcon>
        </Tooltip>
    );
};
