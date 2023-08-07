import React from "react";
import SlugNotFound from "./components/SlugNotFound/SlugNotFound";
import { getDocsPage } from "@mdx/docs";

interface DocsSlugProps {
    params: {
        slug: string[];
    };
}

const DocsSlug = async ({ params: { slug } }: DocsSlugProps) => {
    const [slugGroup, slugPage] = slug;
    if (!slugGroup || !slugPage) return <SlugNotFound />;

    const page = await getDocsPage(slugGroup, slugPage);
    if (!page) return <SlugNotFound />;

    const pageModule = await page.import();
    const { default: Component } = pageModule;

    return <Component />;
};

export default DocsSlug;
