import DocsProvider from "../../../contexts/providers/DocsProvider";
import MantineProviders from "../../../contexts/providers/MantineProviders";
import { getPartialDocs } from "../../../mdx/docs";

interface ProvidersProps {
    children: React.ReactNode;
}

const Providers = async ({ children }: ProvidersProps) => {
    return (
        <MantineProviders>
            <DocsProvider docs={getPartialDocs()}>{children}</DocsProvider>
        </MantineProviders>
    );
};

export default Providers;
