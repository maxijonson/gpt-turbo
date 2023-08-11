"use client";

import {
    Box,
    Center,
    Title,
    Image,
    Stack,
    Text,
    rem,
    Button,
    Group,
    Code,
} from "@mantine/core";
import NextImage from "next/image";
import * as classes from "./HomeHero.css";
import logo from "@public/assets/images/logo/logo-small.png";
import LightDark from "../../../components/LightDark/LightDark";
import { SHELLHEADER_HEIGHT } from "@config/constants";
import Link from "next/link";

const HomeHero = () => {
    return (
        <Box className={classes.root}>
            <Center h={`calc(100% - ${rem(SHELLHEADER_HEIGHT)})`}>
                <Stack align="center" gap={0}>
                    <Image
                        component={NextImage}
                        src={logo}
                        alt="GPT Turbo Logo"
                        w={120}
                        h={120}
                        fit="contain"
                    />
                    <Title order={1} fw={800}>
                        GPT{" "}
                        <Text
                            span
                            fz={34}
                            fw={800}
                            variant="gradient"
                            gradient={{ from: "orange", to: "yellow" }}
                        >
                            Turbo
                        </Text>
                    </Title>
                    <LightDark
                        component={Title}
                        lightProps={{ c: "dark.4" }}
                        darkProps={{ c: "gray.4" }}
                        order={2}
                        fz={24}
                        ta="center"
                    >
                        Give your apps the power of{" "}
                    </LightDark>
                    <Text
                        component={Title}
                        order={3}
                        span
                        variant="gradient"
                        gradient={{ from: "red.6", to: "orange.7" }}
                    >
                        conversational AI
                    </Text>
                    <Group mt="md">
                        <Button component={Link} href="/docs/getting-started/introduction" size="md">
                            Get Started
                        </Button>
                        <Button
                            component={Link}
                            href="/docs"
                            size="md"
                            variant="outline"
                        >
                            Docs
                        </Button>
                    </Group>
                    <Code mt="md" py="xs" px="sm" fz="sm">
                        npm install gpt-turbo
                    </Code>
                </Stack>
            </Center>
        </Box>
    );
};

export default HomeHero;
