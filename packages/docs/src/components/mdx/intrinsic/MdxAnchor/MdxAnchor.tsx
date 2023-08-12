import cx from "clsx";
import { Anchor, AnchorProps, ElementProps } from "@mantine/core";
import type { Url } from "next/dist/shared/lib/router/router";
import Link from "next/link";
import * as classes from "./MdxAnchor.css";

interface MdxAnchorProps
    extends AnchorProps,
        ElementProps<"a", keyof AnchorProps> {}

const MdxAnchor = (props: MdxAnchorProps) => {
    const className = cx(classes.root, props.className);

    if (props.href?.startsWith("/")) {
        return (
            <Anchor
                component={Link}
                href={props.href as Url}
                {...props}
                className={className}
            />
        );
    }

    return <Anchor {...props} className={className} />;
};

export default MdxAnchor;
