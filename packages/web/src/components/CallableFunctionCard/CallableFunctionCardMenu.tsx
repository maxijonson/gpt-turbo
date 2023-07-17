import { Menu, ActionIcon } from "@mantine/core";
import React from "react";
import {
    BiDotsVerticalRounded,
    BiEdit,
    BiDuplicate,
    BiExport,
} from "react-icons/bi";
import { BsTrash } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { callableFunctionExportschema } from "../../entities/callableFunctionExport";
import { useAppStore } from "../../store";
import { deleteCallableFunction } from "../../store/actions/callableFunctions/deleteCallableFunction";
import { duplicateCallableFunction } from "../../store/actions/callableFunctions/duplicateCallableFunction";
import { useGetFunctionDisplayName } from "../../store/hooks/callableFunctions/useGetFunctionDisplayName";
import { useGetFunctionCode } from "../../store/hooks/callableFunctions/useGetFunctionCode";

interface CallableFunctionCardMenuProps {
    id: string;
}

const CallableFunctionCardMenu = ({ id }: CallableFunctionCardMenuProps) => {
    const navigate = useNavigate();
    const fn = useAppStore((state) =>
        state.callableFunctions.find((fn) => fn.id === id)
    );
    const getFunctionDisplayName = useGetFunctionDisplayName();
    const getFunctionCode = useGetFunctionCode();

    const onEdit = React.useCallback(() => {
        if (!fn) return;
        navigate(`/functions/edit/${fn.id}`);
    }, [fn, navigate]);

    const onDelete = React.useCallback(() => {
        if (!fn) return;
        deleteCallableFunction(fn.id);
    }, [fn]);

    const onDuplicate = React.useCallback(() => {
        duplicateCallableFunction(id);
    }, [id]);

    const onExport = React.useCallback(() => {
        if (!fn) return;
        const data = JSON.stringify(
            callableFunctionExportschema.parse({
                callableFunction: fn.toJSON(),
                code: getFunctionCode(fn.id),
                displayName: getFunctionDisplayName(fn.id) ?? "[N/A]",
            })
        );
        const blob = new Blob([data], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `gptturbo-function-${fn.id}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }, [fn, getFunctionCode, getFunctionDisplayName]);

    return (
        <Menu withinPortal withArrow position="bottom-end">
            <Menu.Target>
                <ActionIcon>
                    <BiDotsVerticalRounded />
                </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Item color="blue" onClick={onEdit} icon={<BiEdit />}>
                    Edit
                </Menu.Item>
                <Menu.Item onClick={onDuplicate} icon={<BiDuplicate />}>
                    Duplicate
                </Menu.Item>
                <Menu.Item onClick={onExport} icon={<BiExport />}>
                    Export
                </Menu.Item>
                <Menu.Item onClick={onDelete} icon={<BsTrash />} color="red">
                    Delete
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
};

export default CallableFunctionCardMenu;
