import CallableFunctionsProvider from "./CallableFunctionsProvider";
import ConversationManagerProvider from "./ConversationManagerProvider";
import MantineProviders from "./MantineProviders";
import PersistenceProvider from "./PersistenceProvider";
import SettingsProvider from "./SettingsProvider";

interface ProviderProps {
    children?: React.ReactNode;
}

const Provider = ({ children }: ProviderProps) => {
    return (
        <MantineProviders>
            <SettingsProvider>
                <ConversationManagerProvider>
                    <CallableFunctionsProvider>
                        <PersistenceProvider>{children}</PersistenceProvider>
                    </CallableFunctionsProvider>
                </ConversationManagerProvider>
            </SettingsProvider>
        </MantineProviders>
    );
};

export default Provider;
