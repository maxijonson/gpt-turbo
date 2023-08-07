import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Docs | GPT Turbo",
};

interface DocsLayoutProps {
    children: React.ReactNode;
}

const DocsLayout = ({ children }: DocsLayoutProps) => {
    return <>{children}</>;
};

export default DocsLayout;
