import { Doc } from ".contentlayer/generated";
import { useMDXComponent } from "next-contentlayer/hooks";
import { MDXComponents } from "mdx/types";
import MdxWrapper from "../MdxWrapper/MdxWrapper";
import MdxPreformatted from "../intrinsic/MdxPreformatted/MdxPreformatted";

interface MdxProps {
    doc: Doc;
}

const components: MDXComponents = {
    pre: ({ children }) => <MdxPreformatted>{children}</MdxPreformatted>,
    wrapper: MdxWrapper,
};

const Mdx = ({ doc }: MdxProps) => {
    const Component = useMDXComponent(doc.body.code);
    return <Component components={components} />;
};

export default Mdx;
