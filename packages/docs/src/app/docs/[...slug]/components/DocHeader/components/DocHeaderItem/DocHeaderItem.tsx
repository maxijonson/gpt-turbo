import { Group, Box } from "@mantine/core";

interface DocHeaderItemProps {
    label: string;
    children: React.ReactNode;
}

const DocHeaderItem = ({ label, children }: DocHeaderItemProps) => {
    return (
        <Group>
            <Box w={100} c="dimmed">
                {label}
            </Box>
            {children}
        </Group>
    );
};

export default DocHeaderItem;
