import ConversationManagerProvider from "./ConversationManagerProvider";
import MantineProviders from "./MantineProviders";

interface ProviderProps {
    children?: React.ReactNode;
}

export default ({ children }: ProviderProps) => {
    return (
        <MantineProviders>
            <ConversationManagerProvider>
                {children}
            </ConversationManagerProvider>
        </MantineProviders>
    );
};
