import { Group } from "@mantine/core";
import { AiOutlineFunction } from "react-icons/ai";
import { BiPlus } from "react-icons/bi";
import { Link } from "react-router-dom";
import { setActiveConversation } from "../../../store/actions/conversations/setActiveConversation";
import TippedActionIcon from "../../common/TippedActionIcon";
import SettingsButton from "./SettingsButton";
import { useActiveConversation } from "../../../store/hooks/conversations/useActiveConversation";
import useConversationNavbar from "../../../contexts/hooks/useConversationNavbar";

const ConversationNavbarHeader = () => {
    const activeConversation = useActiveConversation();
    const { closeNavbar } = useConversationNavbar();

    return (
        <Group position="center">
            <SettingsButton />
            {activeConversation && (
                <TippedActionIcon
                    variant="outline"
                    onClick={() => {
                        setActiveConversation(null);
                        closeNavbar();
                    }}
                    tip="Add conversation"
                >
                    <BiPlus />
                </TippedActionIcon>
            )}
            <TippedActionIcon
                component={Link}
                to="/functions"
                tip="Functions Library"
                variant="outline"
            >
                <AiOutlineFunction />
            </TippedActionIcon>
        </Group>
    );
};

export default ConversationNavbarHeader;
