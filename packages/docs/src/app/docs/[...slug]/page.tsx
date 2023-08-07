import { allDocs } from "contentlayer/generated";
import SlugNotFound from "./components/SlugNotFound/SlugNotFound";
import Mdx from "../../../components/mdx/Mdx/Mdx";

interface DocsSlugProps {
    params: {
        slug: string[];
    };
}

const DocsSlugPage = async ({ params: { slug } }: DocsSlugProps) => {
    const doc = allDocs.find((doc) => doc.slug === slug.join("/"));
    if (!doc) return <SlugNotFound />;

    return <Mdx doc={doc} />;
};

export default DocsSlugPage;
