import { TypographyStylesProvider, Container } from "@mantine/core";
import * as classes from "./MdxWrapper.css";

interface MdxWrapperProps {
    children?: React.ReactNode;
}

const MdxWrapper = ({ children }: MdxWrapperProps) => {
    return (
        <TypographyStylesProvider
            classNames={{
                root: classes.root,
            }}
        >
            <Container size="md" pb={80}>
                {children}
            </Container>
        </TypographyStylesProvider>
    );
};

export default MdxWrapper;
