import { Center, Loader, LoaderProps, Stack } from "@mantine/core";

type ContentLoaderProps = LoaderProps & {
    children?: React.ReactNode;
};

const ContentLoader = ({ children, ...loaderProps }: ContentLoaderProps) => {
    return (
        <Center h="100%" w="100%" sx={{ flexGrow: 1 }}>
            <Stack align="center">
                <Loader {...loaderProps} />
                {children}
            </Stack>
        </Center>
    );
};

export default ContentLoader;
