import ConversationManagerProvider from "./ConversationManagerProvider";
import MantineProviders from "./MantineProviders";
import PersistenceProvider from "./PersistenceProvider";
import SettingsProvider from "./SettingsProvider";

interface ProviderProps {
    children?: React.ReactNode;
}

const Provider = ({ children }: ProviderProps) => {
    return (
        <SettingsProvider>
            <ConversationManagerProvider>
                <PersistenceProvider>
                    <MantineProviders>{children}</MantineProviders>
                </PersistenceProvider>
            </ConversationManagerProvider>
        </SettingsProvider>
    );
};

export default Provider;
