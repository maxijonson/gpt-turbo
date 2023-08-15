import { Alert, Anchor } from "@mantine/core";
import { API_BASEURL } from "../../../config/constants";

interface MdxUnderConstructionProps {
    path?: string;
}

const MdxUnderConstruction = ({ path }: MdxUnderConstructionProps) => {
    if (!path) throw new Error("MdxUnderConstruction: path is required");

    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    const href = `${API_BASEURL}${cleanPath}`;

    return (
        <Alert color="yellow" title="Under construction" icon="🚧">
            This page is under construction. Check out the{" "}
            <Anchor href={href}>API reference</Anchor> for the moment!
        </Alert>
    );
};

export default MdxUnderConstruction;
