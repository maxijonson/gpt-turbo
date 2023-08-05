import type { MDXComponents } from "mdx/types";
import MdxPreformatted from "./src/components/mdx/intrinsic/MdxPreformatted/MdxPreformatted";
import MdxWrapper from "./src/components/mdx/MdxWrapper/MdxWrapper";

export function useMDXComponents(components: MDXComponents): MDXComponents {
    return {
        ...components,
        pre: ({ children }) => <MdxPreformatted>{children}</MdxPreformatted>,
        wrapper: MdxWrapper,
    };
}
