import {
    TextInput,
    ActionIcon,
    Title,
    Text,
    createStyles,
} from "@mantine/core";
import { FormFieldValidationResult } from "@mantine/form/lib/types";
import { useDisclosure } from "@mantine/hooks";
import { BiCheck } from "react-icons/bi";

interface CallableFunctionDisplayNameInputProps {
    value: string;
    onChange: (value: string) => void;
    validate: () => FormFieldValidationResult;
}

const useStyles = createStyles((theme) => ({
    title: {
        "&:hover": {
            cursor: "pointer",
            backgroundColor:
                theme.colorScheme === "dark"
                    ? theme.colors.gray[9]
                    : theme.colors.gray[0],
        },
    },
}));

const CallableFunctionDisplayNameInput = ({
    validate,
    ...inputProps
}: CallableFunctionDisplayNameInputProps) => {
    const [
        isEditingTitle,
        { open: startEditingTitle, close: stopEditingTitle },
    ] = useDisclosure();
    const { classes } = useStyles();

    return isEditingTitle ? (
        <TextInput
            {...inputProps}
            onChange={(event) => inputProps.onChange(event.currentTarget.value)}
            placeholder="Display Name"
            size="xl"
            withAsterisk
            description={
                <Text size="xs">
                    Hint: this is only a display name for this app
                </Text>
            }
            rightSection={
                <ActionIcon
                    color="gray"
                    onClick={() => {
                        const validation = validate();
                        if (validation.hasError) {
                            return;
                        }
                        stopEditingTitle();
                    }}
                >
                    <BiCheck />
                </ActionIcon>
            }
        />
    ) : (
        <Title className={classes.title} onClick={startEditingTitle}>
            {inputProps.value}
        </Title>
    );
};

export default CallableFunctionDisplayNameInput;
