import {
    Modal,
    Title,
    ScrollArea,
    Stack,
    Container,
    List,
    Group,
    Button,
    Text,
    Collapse,
    Box,
    Divider,
    Textarea,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React from "react";
import { BiBug, BiTrash, BiRefresh, BiLogoGithub } from "react-icons/bi";
import TippedActionIcon from "../common/TippedActionIcon";
import getErrorInfo from "../../utils/getErrorInfo";
import { storeVersion } from "../../store/persist/migrations";
import getIssueLink, { blockTicks } from "../../utils/getIssueLink";

interface AppErrorModalProps {
    error: Error;
}

const AppErrorModal = ({ error }: AppErrorModalProps) => {
    const [showError, { toggle: toggleShowError }] = useDisclosure();

    const reportLink = React.useMemo(() => {
        const title = "[Bug]: Web Fatal Error";

        const info = getErrorInfo(error);
        const content = {
            "App Version": APP_VERSION,
            "Store Version": storeVersion,
            "Error Info": `${blockTicks}\n${info.title}\n${info.message}\n${blockTicks}`,
            "Stack Trace": `${blockTicks}\n${error.stack}\n${blockTicks}`,
        };
        return getIssueLink(title, content);
    }, [error]);

    return (
        <Modal
            opened
            withCloseButton={false}
            closeOnClickOutside={false}
            closeOnEscape={false}
            onClose={() => {}}
            centered
            title={
                <Title color="red" order={3}>
                    Fatal error
                </Title>
            }
            color="red"
            size="xl"
            scrollAreaComponent={ScrollArea.Autosize}
        >
            <Stack>
                <Container>
                    <Text>
                        The application encountered a fatal error. Try to reload
                        the page. If the issue persists, try opening the app in
                        a private tab:
                        <List>
                            <List.Item>
                                If the app now works in a private tab, you might
                                have invalid or outdated local storage data in
                                your browser. Consider clearing your local
                                storage data{" "}
                                <Text color="red" weight={700} span>
                                    which will clear all your settings and
                                    conversations
                                </Text>
                            </List.Item>
                            <List.Item>
                                If the app still does not work in a private tab,
                                you might have encountered a bug. You may report
                                it on the project's project's GitHub issues
                                page. In order to help us resolve this issue,
                                please include the error information below by
                                clicking on the{" "}
                                <TippedActionIcon
                                    onClick={toggleShowError}
                                    tip="Show Error"
                                    variant="subtle"
                                    color="red"
                                    radius="xl"
                                    size="md"
                                    style={{ display: "inline-flex" }}
                                >
                                    <BiBug />
                                </TippedActionIcon>{" "}
                                icon or the "Report issue on GitHub" button to
                                pre-fill this information!
                            </List.Item>
                        </List>
                    </Text>
                </Container>
                <Box>
                    <Divider
                        label={
                            <TippedActionIcon
                                onClick={toggleShowError}
                                tip="Show Error"
                                variant="outline"
                                color="red"
                                radius="xl"
                            >
                                <BiBug />
                            </TippedActionIcon>
                        }
                        labelPosition="center"
                        mb="xs"
                    />
                    <Collapse in={showError}>
                        <Textarea
                            value={error.stack}
                            readOnly
                            size="xs"
                            autosize
                            wrap="off"
                            maxRows={10}
                        />
                    </Collapse>
                </Box>
                <Group position="right">
                    <Button
                        variant="outline"
                        leftIcon={<BiLogoGithub />}
                        component="a"
                        target="_blank"
                        href={reportLink}
                    >
                        Report on GitHub
                    </Button>
                    <Button
                        variant="outline"
                        color="red"
                        leftIcon={<BiTrash />}
                        onClick={() => {
                            localStorage.clear();
                            window.location.reload();
                        }}
                    >
                        Clear local storage
                    </Button>
                    <Button
                        leftIcon={<BiRefresh />}
                        onClick={() => window.location.reload()}
                    >
                        Reload
                    </Button>
                </Group>
            </Stack>
        </Modal>
    );
};

export default AppErrorModal;
