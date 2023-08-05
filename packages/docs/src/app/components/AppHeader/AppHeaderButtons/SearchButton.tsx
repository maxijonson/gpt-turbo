import { ActionIcon } from "@mantine/core";
import { BiSearch } from "react-icons/bi";
import { docsSpotlight } from "../../DocsSpotlight/DocsSpotlight";

const SearchButton = () => {
    return (
        <ActionIcon
            size="lg"
            radius="xl"
            variant="default"
            onClick={docsSpotlight.open}
        >
            <BiSearch size={20} />
        </ActionIcon>
    );
};

export default SearchButton;
