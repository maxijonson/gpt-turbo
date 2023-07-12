import { Box, Text } from "@mantine/core";

const AppStorageUsage = () => {
    return (
        <Box>
            <Text>Storage Usage</Text>
            <Text size="xs" color="dimmed" mb="xs">
                This is an estimate, assuming a 5MB quota. (default for most
                browsers)
            </Text>
        </Box>
    );
};

export default AppStorageUsage;
