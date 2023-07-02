import { Button, Menu, Text, Tooltip, rem } from "@mantine/core";
import { BiPlus } from "react-icons/bi";
import { Link } from "react-router-dom";
import functionTemplates from "../utils/functionTemplates";

const CallableFunctionCreateButton = () => {
    return (
        <Menu
            withArrow
            transitionProps={{ transition: "scale" }}
            width={rem(200)}
        >
            <Menu.Target>
                <Button leftIcon={<BiPlus />} variant="gradient">
                    Create
                </Button>
            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Item
                    component={Link}
                    to="/functions/create"
                    icon={<BiPlus />}
                >
                    From Scratch
                </Menu.Item>
                <Menu.Divider />
                <Menu.Label>Template</Menu.Label>
                {functionTemplates.map(
                    ({ template, displayName, description }) => (
                        <Menu.Item
                            key={template}
                            component={Link}
                            to={`/functions/create?template=${template}`}
                        >
                            <Tooltip
                                label={description}
                                multiline
                                width={200}
                                position="left"
                                withArrow
                                offset={20}
                            >
                                <Text>{displayName}</Text>
                            </Tooltip>
                        </Menu.Item>
                    )
                )}
            </Menu.Dropdown>
        </Menu>
    );
};

export default CallableFunctionCreateButton;
