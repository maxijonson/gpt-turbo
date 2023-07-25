import { Tabs, useMantineTheme } from "@mantine/core";
import GeneralSettings from "./GeneralSettings";
import React from "react";
import { useMediaQuery } from "@mantine/hooks";
import { BiCog, BiData } from "react-icons/bi";
import DataSettings from "./DataSettings";

type AppSettingsTab = "general" | "data";

const AppSettings = () => {
    const theme = useMantineTheme();
    const isSm = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);

    const [currentTab, setCurrentTab] =
        React.useState<AppSettingsTab>("general");

    return (
        <Tabs
            keepMounted={false}
            value={currentTab}
            onTabChange={(tab) =>
                setCurrentTab((tab as AppSettingsTab) ?? "general")
            }
            orientation={isSm ? "horizontal" : "vertical"}
            mih="40vh"
            variant="outline"
        >
            <Tabs.List mb={isSm ? "md" : undefined}>
                <Tabs.Tab value="general" icon={<BiCog />}>
                    General
                </Tabs.Tab>
                <Tabs.Tab value="data" icon={<BiData />}>
                    Data
                </Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="general" px="md">
                <GeneralSettings />
            </Tabs.Panel>
            <Tabs.Panel value="data" px="md">
                <DataSettings />
            </Tabs.Panel>
        </Tabs>
    );
};

export default AppSettings;
