import { Tooltip } from "@mantine/core";
import React from "react";

const NavbarConverationInfoIcon = ({
    IconType,
    label,
}: {
    IconType: React.ReactNode;
    label: string;
}) => {
    if (IconType === null) return null;
    return (
        <Tooltip label={label} withArrow>
            <div>{IconType}</div>
        </Tooltip>
    );
};

export default NavbarConverationInfoIcon;
