import { Title, TitleOrder } from "@mantine/core";
import React from "react";
import * as classes from "./MdxTitle.css";

interface MdxTitleProps extends React.ComponentPropsWithoutRef<typeof Title> {}

const MdxTitle = ({ id, ...props }: MdxTitleProps) => {
    return (
        <>
            <div id={id} className={classes.idMarker} />
            <Title {...props} />
        </>
    );
};

export default MdxTitle;

export const h = (order: TitleOrder) => {
    const MdxTitleH = (props: Exclude<MdxTitleProps, "order">) => (
        <MdxTitle order={order} {...props} />
    );
    return MdxTitleH;
};
