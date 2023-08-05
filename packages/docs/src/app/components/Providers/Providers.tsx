"use client";

import { ActionIcon, MantineProvider, Title, createTheme } from "@mantine/core";
import { theme } from "@theme";
import * as classes from "./Providers.css";

interface ProvidersProps {
    children: React.ReactNode;
}

const Providers = ({ children }: ProvidersProps) => {
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

export default Providers;
