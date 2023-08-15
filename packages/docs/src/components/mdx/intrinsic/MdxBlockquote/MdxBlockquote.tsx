import { Blockquote, BlockquoteProps, ElementProps } from "@mantine/core";

interface MdxBlockquoteProps
    extends BlockquoteProps,
        ElementProps<"blockquote", keyof BlockquoteProps> {}

const MdxBlockquote = (props: MdxBlockquoteProps) => {
    return <Blockquote fz={15} pb={1} {...props} />;
};

export default MdxBlockquote;
