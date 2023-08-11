import { Doc } from ".contentlayer/generated";
import { useMDXComponent } from "next-contentlayer/hooks";
import { MDXComponents } from "mdx/types";
import MdxWrapper from "../MdxWrapper/MdxWrapper";
import MdxPreformatted from "../intrinsic/MdxPreformatted/MdxPreformatted";
import MdxBlockquote from "../intrinsic/MdxBlockquote/MdxBlockquote";
import { h } from "../intrinsic/MdxTitle/MdxTitle";
import { Box } from "@mantine/core";
import { MDX_ROOT_ID } from "@config/constants";

interface MdxProps {
    doc: Doc;
}

const components: MDXComponents = {
    wrapper: MdxWrapper,
    pre: ({ children }) => <MdxPreformatted>{children}</MdxPreformatted>,
    blockquote: MdxBlockquote,
    h1: h(1),
    h2: h(2),
    h3: h(3),
    h4: h(4),
    h5: h(5),
    h6: h(6),
};

const Mdx = ({ doc }: MdxProps) => {
    const Component = useMDXComponent(doc.body.code);
    return (
        <Box id={MDX_ROOT_ID}>
            <Component components={components} />
        </Box>
    );
};

export default Mdx;
