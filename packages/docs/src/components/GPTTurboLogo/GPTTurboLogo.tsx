"use client";

import { BoxProps, createPolymorphicComponent } from "@mantine/core";
import logoFullLight from "@public/assets/images/logo/logo-inline-transparent-dark.png";
import logoFullDark from "@public/assets/images/logo/logo-inline-transparent.png";
import logoSmallLight from "@public/assets/images/logo/logo-small.png";
import logoSmallDark from "@public/assets/images/logo/logo-small.png";
import LightDark from "../LightDark/LightDark";
import { forwardRef } from "react";
import MantineNextImage from "../MantineNextImage/MantineNextImage";

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
                component={MantineNextImage}
                src={small ? logoSmallLight : logoFullLight}
                w="100%"
                h="100%"
                fit="contain"
                priority
                alt="GPT Turbo Logo"
                lightProps={{
                    src: small ? logoSmallLight : logoFullLight,
                }}
                darkProps={{
                    src: small ? logoSmallDark : logoFullDark,
                }}
            />
        );
    })
);

export default GPTTurboLogo;
