import { Button, ButtonProps } from "@mantine/core";
import { useDisclosure, useTimeout } from "@mantine/hooks";
import React from "react";

interface InlineConfirmButtonBaseProps {
    onConfirm: () => void;
    confirm?: React.ReactNode;
    confirmVariant?: ButtonProps["variant"];
    timeout?: number;
    onClick?: () => void;
}

type InlineConfirmButtonButtonProps<C = "button"> =
    import("@mantine/utils").PolymorphicComponentProps<C, ButtonProps>;

type InlineConfirmButtonProps<C = "button"> = InlineConfirmButtonBaseProps &
    InlineConfirmButtonButtonProps<C>;

const InlineConfirmButton = <C = "button",>({
    onConfirm,
    confirm,
    confirmVariant = "filled",
    children,
    variant = "outline",
    onClick,
    ...buttonProps
}: InlineConfirmButtonProps<C>) => {
    const [isConfirm, { open: showConfirm, close: hideConfirm }] =
        useDisclosure();
    const { start: startConfirmTimeout, clear: clearConfirmTimeout } =
        useTimeout(() => hideConfirm(), 3000);

    const startConfirm = React.useCallback(() => {
        showConfirm();
        startConfirmTimeout();
    }, [showConfirm, startConfirmTimeout]);

    const stopConfirm = React.useCallback(() => {
        hideConfirm();
        clearConfirmTimeout();
    }, [clearConfirmTimeout, hideConfirm]);

    const handleClick = React.useCallback(() => {
        onClick?.();
        if (!isConfirm) return startConfirm();
        onConfirm();
        stopConfirm();
    }, [onClick, isConfirm, startConfirm, onConfirm, stopConfirm]);

    return (
        <Button
            {...buttonProps}
            variant={isConfirm ? confirmVariant : variant}
            onClick={handleClick}
        >
            {isConfirm ? confirm ?? children : children}
        </Button>
    );
};

export default InlineConfirmButton;
