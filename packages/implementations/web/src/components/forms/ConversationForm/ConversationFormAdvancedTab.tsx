import { Box, Grid, TextInput } from "@mantine/core";
import useConversationForm from "../../../contexts/hooks/useConversationForm";
import LogitBiasInput from "../../inputs/LogitBiasInput";
import OptionalNumberInput from "../../inputs/OptionalNumberInput";
import StopInput from "../../inputs/StopInput";

const ConversationFormAdvancedTab = () => {
    const form = useConversationForm();

    return (
        <Box>
            <Grid align="end">
                <Grid.Col span={4}>
                    <OptionalNumberInput
                        {...form.getInputProps("max_tokens")}
                        label="Max Tokens"
                        step={1}
                        precision={0}
                        min={1}
                        max={Infinity}
                    />
                </Grid.Col>
                <Grid.Col span={4}>
                    <TextInput
                        {...form.getInputProps("user")}
                        value={form.values.user || ""}
                        label="User"
                    />
                </Grid.Col>
                <Grid.Col span={4}>
                    <OptionalNumberInput
                        {...form.getInputProps("temperature")}
                        label="Temperature"
                        max={2}
                    />
                </Grid.Col>
            </Grid>
            <Grid align="end">
                <Grid.Col span={4}>
                    <OptionalNumberInput
                        {...form.getInputProps("frequency_penalty")}
                        label="Frequency Penalty"
                        min={-2}
                        max={2}
                    />
                </Grid.Col>
                <Grid.Col span={4}>
                    <OptionalNumberInput
                        {...form.getInputProps("presence_penalty")}
                        label="Presence Penalty"
                        min={-2}
                        max={2}
                    />
                </Grid.Col>
                <Grid.Col span={4}>
                    <OptionalNumberInput
                        {...form.getInputProps("top_p")}
                        label="Top P"
                    />
                </Grid.Col>
            </Grid>
            <StopInput {...form.getInputProps("stop")} />
            <LogitBiasInput {...form.getInputProps("logit_bias")} />
        </Box>
    );
};

export default ConversationFormAdvancedTab;
