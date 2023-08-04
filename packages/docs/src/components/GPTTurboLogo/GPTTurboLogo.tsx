"use client";

import { BoxProps, Image, createPolymorphicComponent } from "@mantine/core";
import NextImage from "next/image";
import logoFullLight from "@public/assets/images/logo/logo-inline-transparent-dark.png";
import logoFullDark from "@public/assets/images/logo/logo-inline-transparent.png";
import logoSmallLight from "@public/assets/images/logo/logo-small.png";
import logoSmallDark from "@public/assets/images/logo/logo-small.png";
import LightDark from "../LightDark/LightDark";
import { forwardRef } from "react";

interface GPTTurboLogoProps extends BoxProps {
    small?: boolean;
}

const GPTTurboLogo = createPolymorphicComponent<"div", GPTTurboLogoProps>(
    // eslint-disable-next-line react/display-name
    forwardRef<HTMLDivElement, GPTTurboLogoProps>(function GPTTurboLogo(
        { small = false, ...rest },
        ref
    ) {
        return (
            <LightDark
                {...rest}
                ref={ref}
                light={
                    <Image
                        src={small ? logoSmallLight : logoFullLight}
                        alt="GPT Turbo Logo"
                        component={NextImage}
                        w="100%"
                        h="100%"
                        fit="contain"
                        priority
                    />
                }
                dark={
                    <Image
                        src={small ? logoSmallDark : logoFullDark}
                        alt="GPT Turbo Logo"
                        component={NextImage}
                        w="100%"
                        h="100%"
                        fit="contain"
                        priority
                    />
                }
            />
        );
    })
);

export default GPTTurboLogo;
