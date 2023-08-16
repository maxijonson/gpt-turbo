import { MetadataRoute } from "next";
import { BASEURL } from "../config/constants";

const robots = (): MetadataRoute.Robots => {
    const baseUrl = new URL(BASEURL);

    return {
        rules: {
            userAgent: "*",
            allow: "/",
        },
        sitemap: `${baseUrl.origin}/sitemap.xml`,
    };
};

export default robots;
