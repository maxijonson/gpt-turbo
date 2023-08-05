import cx from "clsx";
import {
    ElementProps,
    Group,
    Text,
    UnstyledButton,
    UnstyledButtonProps,
} from "@mantine/core";
import { BiSearch } from "react-icons/bi";
import * as classes from "./DocsSearchButton.css";
import { docsSpotlight } from "../../../DocsSpotlight/DocsSpotlight";

interface DocsSearchButtonProps
    extends UnstyledButtonProps,
        ElementProps<"button", keyof UnstyledButtonProps> {}

const DocsSearchButton = ({ ...buttonProps }: DocsSearchButtonProps) => {
    return (
        <UnstyledButton
            onClick={docsSpotlight.open}
            {...buttonProps}
            className={cx(classes.root, buttonProps.className)}
        >
            <Group
                wrap="nowrap"
                justify="space-between"
                className={classes.group}
            >
                <BiSearch />
                <Text size="sm" style={{ flexGrow: 1 }} c="dimmed">
                    Search Docs
                </Text>
                <Text fz={10} p={2} className={classes.shortcut}>
                    Ctrl+K
                </Text>
            </Group>
        </UnstyledButton>
    );
};

export default DocsSearchButton;
