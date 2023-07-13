import { Modal, ScrollArea, Center, Loader, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React, { Suspense } from "react";
import { BiCodeAlt } from "react-icons/bi";
import TippedActionIcon from "./TippedActionIcon";
import { useAppStore } from "../store";
import { changelog } from "../changelog";
import { setLastChangelog } from "../store/actions/appSettings/setLastChangelog";

const Changelog = React.lazy(() => import("./Changelog"));

const latestChangelogVersion = changelog[0].version;

const ChangelogButton = () => {
    const lastChangelog = useAppStore((state) => state.lastChangelog);
    const [changelogOpened, { open: openChangelog, close: closeChangelog }] =
        useDisclosure();

    React.useEffect(() => {
        if (lastChangelog !== latestChangelogVersion) {
            openChangelog();
            setLastChangelog(latestChangelogVersion);
        }
    }, [lastChangelog, openChangelog]);

    return (
        <>
            <TippedActionIcon tip="Changelog" onClick={openChangelog} size="xs">
                <BiCodeAlt />
            </TippedActionIcon>
            <Modal
                opened={changelogOpened}
                onClose={closeChangelog}
                size="lg"
                centered
                title={
                    <Text size={24} weight="bold">
                        Changelog
                    </Text>
                }
                scrollAreaComponent={ScrollArea.Autosize}
            >
                <Suspense
                    fallback={
                        <Center>
                            <Loader />
                        </Center>
                    }
                >
                    <Changelog />
                </Suspense>
            </Modal>
        </>
    );
};

export default ChangelogButton;
