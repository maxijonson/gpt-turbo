import cx from "clsx";
import * as classes from "./MdxPreformatted.css";
import { CodeHighlight, CodeHighlightProps } from "@mantine/code-highlight";
import { ElementProps } from "@mantine/core";
import React from "react";

interface MdxPreformattedPropsBase
    extends CodeHighlightProps,
        ElementProps<typeof CodeHighlight, keyof CodeHighlightProps> {}

type MdxPreformattedProps = Omit<MdxPreformattedPropsBase, "code"> & {
    code?: MdxPreformattedPropsBase["code"];
};

const getLanguage = (children: any) => {
    const matches = (children.props.className || "").match(
        /language-(?<lang>.*)/
    );
    return matches && matches.groups && matches.groups.lang
        ? matches.groups.lang
        : "tsx";
};

const getCode = (children: any) => {
    return children.props.children;
};

const MdxPreformatted = ({ className, ...props }: MdxPreformattedProps) => {
    const code = props.code ?? getCode(props.children);

    return (
        <CodeHighlight
            className={cx(classes.root, className)}
            language={getLanguage(props.children)}
            my="md"
            {...props}
            code={code}
        />
    );
};

export default MdxPreformatted;
