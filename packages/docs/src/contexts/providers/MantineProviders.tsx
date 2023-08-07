"use client";

import { ActionIcon, MantineProvider, Title, createTheme } from "@mantine/core";
import { theme } from "@theme";
import * as classes from "../../app/components/Providers/Providers.css";

interface MantineProvidersProps {
    children: React.ReactNode;
}

const MantineProviders = ({ children }: MantineProvidersProps) => {
    return (
        <MantineProvider
            theme={createTheme({
                ...theme,
                components: {
                    ActionIcon: ActionIcon.extend({
                        defaultProps: {
                            variant: "subtle",
                        },
                    }),
                    Title: Title.extend({
                        classNames: {
                            root: classes.titleRoot,
                        },
                    }),
                },
            })}
        >
            {children}
        </MantineProvider>
    );
};

export default MantineProviders;
