import { Metadata } from "next";
import { getDocsPage } from "@mdx/docs";

interface DocsSlugLayoutProps {
    children: React.ReactNode;
    params: {
        slug: string[];
    };
}

export const generateMetadata = async ({
    params: { slug },
}: DocsSlugLayoutProps): Promise<Metadata> => {
    const [slugGroup, slugPage] = slug;
    if (!slugGroup || !slugPage) return {};

    const page = await getDocsPage(slugGroup, slugPage);
    if (!page) return {};

    const pageModule = await page.import();
    const { title } = pageModule;
    const metadata: Metadata = {};

    if (title) metadata.title = `${title} | GPT Turbo`;

    return metadata;
};

const DocsSlugLayout = async ({ children }: DocsSlugLayoutProps) => {
    return <>{children}</>;
};

export default DocsSlugLayout;
