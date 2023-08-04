import { Group, Text, UnstyledButton } from "@mantine/core";
import { BiSearch } from "react-icons/bi";
import * as classes from "./FakeSearch.css";

const FakeSearch = () => {
    return (
        <UnstyledButton className={classes.root}>
            <Group wrap="nowrap" className={classes.group}>
                <BiSearch />
                <Text size="sm">Search Docs</Text>
            </Group>
        </UnstyledButton>
    );
};

export default FakeSearch;
