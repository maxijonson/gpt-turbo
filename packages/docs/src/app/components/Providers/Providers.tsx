import MantineProviders from "../../../contexts/providers/MantineProviders";

interface ProvidersProps {
    children: React.ReactNode;
}

const Providers = async ({ children }: ProvidersProps) => {
    return <MantineProviders>{children}</MantineProviders>;
};

export default Providers;
