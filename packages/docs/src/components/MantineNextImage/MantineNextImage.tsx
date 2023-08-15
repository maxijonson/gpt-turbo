import { ElementProps, Image, ImageProps } from "@mantine/core";
import NextImage, { ImageProps as NextImageProps } from "next/image";

interface MantineNextImageProps
    extends ImageProps,
        ElementProps<"img", keyof ImageProps> {}

const MantineNextImage = (props: MantineNextImageProps & NextImageProps) => (
    // eslint-disable-next-line jsx-a11y/alt-text
    <Image component={NextImage} {...props} />
);

export default MantineNextImage;
