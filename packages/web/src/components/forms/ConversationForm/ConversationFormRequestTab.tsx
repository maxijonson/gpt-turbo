import { Stack } from "@mantine/core";
import useConversationForm from "../../../hooks/useConversationForm";
import HeadersInput from "../../inputs/HeadersInput";
import ProxyInput from "../../inputs/ProxyInput";

const ConversationFormRequestTab = () => {
    const form = useConversationForm();

    return (
        <Stack>
            <ProxyInput {...form.getInputProps("proxy")} />
            <HeadersInput {...form.getInputProps("headers")} />
        </Stack>
    );
};

export default ConversationFormRequestTab;