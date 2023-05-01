import React from "react";
import { Select, Stack, Text, useMantineTheme } from "@mantine/core";

interface ModelSelectInputProps {
    value: string;
    onChange: (value: string) => void;
}

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

export default ({ value, onChange }: ModelSelectInputProps) => {
    const [modelOptions, setModelOptions] = React.useState([
        { label: "GPT 3.5", value: "gpt-3.5-turbo" },
        { label: "GPT 4", value: "gpt-4" },
        { label: "GPT 4 (32k)", value: "gpt-4-32k" },
    ]);

    const onCreate = React.useCallback((value: string) => {
        const item = { value, label: value };
        setModelOptions((current) => [...current, item]);
        return item;
    }, []);

    return (
        <Select
            value={value}
            onChange={onChange}
            label="Model"
            searchable
            creatable
            itemComponent={ModelSelectItem}
            data={modelOptions}
            getCreateLabel={(value) => `Create "${value}"`}
            onCreate={onCreate}
            sx={{ flexGrow: 1 }}
        />
    );
};
