import CallableFunctionsProvider from "./CallableFunctionsProvider";
import ConversationManagerProvider from "./ConversationManagerProvider";
import MantineProviders from "./MantineProviders";

interface ProviderProps {
    children?: React.ReactNode;
}

const Provider = ({ children }: ProviderProps) => {
    return (
        <MantineProviders>
            <ConversationManagerProvider>
                <CallableFunctionsProvider>
                    {children}
                </CallableFunctionsProvider>
            </ConversationManagerProvider>
        </MantineProviders>
    );
};

export default Provider;
