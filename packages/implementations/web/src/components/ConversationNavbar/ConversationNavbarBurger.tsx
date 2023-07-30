import { MediaQuery, Burger, createStyles } from "@mantine/core";
import useConversationNavbar from "../../contexts/hooks/useConversationNavbar";

const useStyles = createStyles(() => ({
    burger: {
        position: "absolute",
        top: 0,
        right: 0,
        zIndex: 101,
    },
}));

const ConversationNavbarBurger = () => {
    const { classes } = useStyles();
    const { navbarOpened, toggleNavbar } = useConversationNavbar();
    return (
        <MediaQuery
            largerThan="sm"
            styles={{
                display: "none",
            }}
        >
            <Burger
                className={classes.burger}
                opened={navbarOpened}
                onClick={toggleNavbar}
                size="sm"
                mt="xs"
                mr="sm"
            />
        </MediaQuery>
    );
};

export default ConversationNavbarBurger;
