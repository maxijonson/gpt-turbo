import { ActionIcon } from "@mantine/core";
import { BiSearch } from "react-icons/bi";

const SearchButton = () => {
    return (
        <ActionIcon size="lg" radius="xl" variant="default">
            <BiSearch size={20} />
        </ActionIcon>
    );
};

export default SearchButton;
