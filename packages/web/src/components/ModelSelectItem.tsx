import { useMantineTheme, Stack, Text } from "@mantine/core";
import React from "react";

const ModelSelectItem = React.forwardRef<
    HTMLDivElement,
    { label: string; value: string; selected: boolean }
>(({ label, value, ...restProps }, ref) => {
    const theme = useMantineTheme();
    const { selected } = restProps;

    const subColor = (() => {
        const dark = theme.colorScheme === "dark";

        if (dark && selected) {
            return theme.colors.gray[4];
        } else if (dark && !selected) {
            return theme.colors.gray[6];
        } else if (selected) {
            return theme.colors.gray[3];
        } else {
            return theme.colors.gray[6];
        }
    })();

    return (
        <Stack ref={ref} spacing={0} p="xs" {...restProps}>
            <Text>{label}</Text>
            <Text size="xs" color={subColor}>
                {value}
            </Text>
        </Stack>
    );
});

export default ModelSelectItem;
