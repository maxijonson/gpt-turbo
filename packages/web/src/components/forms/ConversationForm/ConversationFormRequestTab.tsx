import { Stack } from "@mantine/core";
import HeadersInput from "../../inputs/HeadersInput";
import ProxyInput from "../../inputs/ProxyInput";
import useConversationForm from "../../../contexts/hooks/useConversationForm";

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
