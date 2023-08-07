import { Metadata } from "next/types";
import { allDocs } from "../../../../.contentlayer/generated";

interface DocsSlugLayoutProps {
    children: React.ReactNode;
    params: {
        slug: string[];
    };
}

export const generateMetadata = ({
    params: { slug },
}: DocsSlugLayoutProps): Metadata => {
    const doc = allDocs.find((doc) => doc.slug === slug.join("/"));
    if (!doc) return {};

    const metadata: Metadata = {
        title: `${doc.title} | GPT Turbo`,
    };

    return metadata;
};

const DocsSlugLayout = ({ children }: DocsSlugLayoutProps) => {
    return <>{children}</>;
};

export default DocsSlugLayout;
