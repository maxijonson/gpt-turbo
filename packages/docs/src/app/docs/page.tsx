import { Metadata } from "next";
import Hello from "@mdx/hello.mdx";

export const metadata: Metadata = {
    title: "Docs | GPT Turbo",
};

const DocsPage = () => {
    return <Hello />;
};

export default DocsPage;
