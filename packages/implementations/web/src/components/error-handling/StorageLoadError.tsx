import {
    Accordion,
    Button,
    Group,
    JsonInput,
    Stack,
    Text,
    Textarea,
} from "@mantine/core";
import React from "react";
import getErrorInfo from "../../utils/getErrorInfo";
import { STORAGE_PERSISTENCE_KEY } from "../../config/constants";
import { BiLogoGithub } from "react-icons/bi";
import { BsFire } from "react-icons/bs";
import { storeVersion } from "../../store/persist/migrations";
import getIssueLink, { blockTicks } from "../../utils/getIssueLink";

interface StorageLoadErrorProps {
    isMigrationError: boolean;
    error: Error;
    currentData: string;
}

const StorageLoadError = ({
    isMigrationError,
    error,
    currentData,
}: StorageLoadErrorProps) => {
    const reportLink = React.useMemo(() => {
        const title = `[Bug]: Web Storage ${
            isMigrationError ? "Migration" : "Load"
        } Error`;

        const info = getErrorInfo(error);
        const content = {
            "App Version": APP_VERSION,
            "Store Version": storeVersion,
            "Is Migration Error": isMigrationError,
            "Error Info": `${blockTicks}\n${info.title}\n${info.message}\n${blockTicks}`,
            "Stack Trace": `${blockTicks}\n${error.stack}\n${blockTicks}`,
            "Current Data": `${blockTicks}json\n${currentData}\n${blockTicks}`,
        };
        return getIssueLink(title, content);
    }, [currentData, error, isMigrationError]);

    return (
        <Stack>
            <Text>
                {isMigrationError
                    ? "There was an error migrating your saved data to the latest version. "
                    : "There was an error loading your saved data. "}
                <Text span>
                    Right now, your saved data is still stored in your browser's
                    local storage, has been logged to the console and is visible
                    below to ensure you have a temporary copy. However, the
                    application cannot be used with invalid/corrupted data.
                </Text>
            </Text>
            <Text>
                Unfortunately, local storage is a pretty "primitive" storage
                mechanism, so it is not easy to ensure data integrity as the
                application evolves and there are no fixes other than editing
                the value manually... If you're comfortable working with JSON,
                you can try to fix the data yourself.
            </Text>
            <Text>
                Ultimately, it's recommended to erase your saved data and start
                fresh. You can do this by clicking the "Reset" button below.
            </Text>
            <Text>
                If you think this is an unexpected bug, you can report it on
                GitHub. Press the "Report on GitHub" button below to open a new
                issue with the error information pre-filled. (Please check for
                any sensitive information before submitting!)
            </Text>
            <Text>Sorry for the inconvenience!</Text>
            <Accordion>
                <Accordion.Item value="currentData">
                    <Accordion.Control>Current Data</Accordion.Control>
                    <Accordion.Panel>
                        <JsonInput
                            value={currentData}
                            readOnly
                            autosize
                            maxRows={10}
                        />
                    </Accordion.Panel>
                </Accordion.Item>
                <Accordion.Item value="error">
                    <Accordion.Control>Error</Accordion.Control>
                    <Accordion.Panel>
                        <Textarea
                            value={error.stack}
                            readOnly
                            size="xs"
                            autosize
                            wrap="off"
                            maxRows={10}
                        />
                    </Accordion.Panel>
                </Accordion.Item>
            </Accordion>
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
                    color="red"
                    leftIcon={<BsFire />}
                    onClick={() => {
                        localStorage.removeItem(STORAGE_PERSISTENCE_KEY);
                        window.location.reload();
                    }}
                >
                    Reset
                </Button>
            </Group>
        </Stack>
    );
};

export default StorageLoadError;
