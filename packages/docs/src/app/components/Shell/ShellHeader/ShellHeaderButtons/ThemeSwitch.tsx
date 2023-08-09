"use client";

import {
    ActionIcon,
    Center,
    useComputedColorScheme,
    useMantineColorScheme,
} from "@mantine/core";
import { BiMoon, BiSun } from "react-icons/bi";
import LightDark from "@components/LightDark/LightDark";
import React from "react";

const ThemeSwitch = () => {
    const { setColorScheme } = useMantineColorScheme();
    const colorScheme = useComputedColorScheme("light", {
        getInitialValueInEffect: true,
    });

    const switchTo = colorScheme === "dark" ? "light" : "dark";

    return (
        <ActionIcon
            size="lg"
            radius="xl"
            onClick={() => setColorScheme(switchTo)}
            variant="default"
        >
            <LightDark
                component={Center}
                light={<BiSun size={20} />}
                dark={<BiMoon size={20} />}
            />
        </ActionIcon>
    );
};

export default ThemeSwitch;
