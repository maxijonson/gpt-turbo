import MantineProviders from "./MantineProviders";

interface ProviderProps {
    children?: React.ReactNode;
}

const Provider = ({ children }: ProviderProps) => {
    return <MantineProviders>{children}</MantineProviders>;
};

export default Provider;
