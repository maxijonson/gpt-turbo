import { Box, TextInput } from "@mantine/core";
import { BiSearch } from "react-icons/bi";

const AppHeaderSearch = () => {
    return (
        <Box w="100%">
            <TextInput
                leftSection={<BiSearch />}
                placeholder="Search Docs"
                radius="xl"
            />
        </Box>
    );
};

export default AppHeaderSearch;
