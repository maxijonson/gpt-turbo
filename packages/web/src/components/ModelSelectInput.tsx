import React from "react";
import { Select } from "@mantine/core";
import ModelSelectItem from "./ModelSelectItem";

interface ModelSelectInputProps {
    value: string;
    onChange: (value: string) => void;
}

const ModelSelectInput = ({ value, onChange }: ModelSelectInputProps) => {
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

export default ModelSelectInput;
