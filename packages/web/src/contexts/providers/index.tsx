import ConversationManagerProvider from "./ConversationManagerProvider";
import MantineProviders from "./MantineProviders";
import SettingsProvider from "./SettingsProvider";

interface ProviderProps {
    children?: React.ReactNode;
}

export default ({ children }: ProviderProps) => {
    return (
        <SettingsProvider>
            <ConversationManagerProvider>
                <MantineProviders>{children}</MantineProviders>
            </ConversationManagerProvider>
        </SettingsProvider>
    );
};
