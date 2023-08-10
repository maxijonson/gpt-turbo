import { Metadata } from "next/types";
import { getDocBySlug } from "@mdx/docs";

interface DocsSlugLayoutProps {
    children: React.ReactNode;
    params: {
        slug: string[];
    };
}

export const generateMetadata = ({
    params: { slug },
}: DocsSlugLayoutProps): Metadata => {
    const doc = getDocBySlug(slug);
    if (!doc) return {};

    const metadata: Metadata = {
        title: `${doc.title} | GPT Turbo`,
        description: doc.description,
    };

    return metadata;
};

const DocsSlugLayout = ({ children }: DocsSlugLayoutProps) => {
    return <>{children}</>;
};

export default DocsSlugLayout;
