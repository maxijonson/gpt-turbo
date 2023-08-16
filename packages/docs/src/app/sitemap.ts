import { MetadataRoute } from "next";
import { BASEURL } from "../config/constants";
import { allDocs } from ".contentlayer/generated";

const sitemap = (): MetadataRoute.Sitemap => {
    const baseUrl = new URL(BASEURL);

    return [
        {
            url: baseUrl.origin,
        },
        ...allDocs.map((doc) => ({
            url: `${baseUrl.origin}/docs/${doc.slug}`,
        })),
    ];
};

export default sitemap;
