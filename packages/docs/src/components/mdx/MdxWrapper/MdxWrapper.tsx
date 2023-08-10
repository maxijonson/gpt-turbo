import { TypographyStylesProvider, Container } from "@mantine/core";
import * as classes from "./MdxWrapper.css";

interface MdxWrapperProps {
    children?: React.ReactNode;
}

const MdxWrapper = ({ children }: MdxWrapperProps) => {
    return (
        <TypographyStylesProvider
            pl={0}
            classNames={{
                root: classes.root,
            }}
            fz={15}
        >
            <Container size="md" pb={80} px="xl">
                {children}
            </Container>
        </TypographyStylesProvider>
    );
};

export default MdxWrapper;
