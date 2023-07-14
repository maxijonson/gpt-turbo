import CallableFunctionsProvider from "./CallableFunctionsProvider";
import MantineProviders from "./MantineProviders";

interface ProviderProps {
    children?: React.ReactNode;
}

const Provider = ({ children }: ProviderProps) => {
    return (
        <MantineProviders>
            <CallableFunctionsProvider>{children}</CallableFunctionsProvider>
        </MantineProviders>
    );
};

export default Provider;
