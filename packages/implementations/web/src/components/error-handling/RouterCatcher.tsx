import { useRouteError } from "react-router-dom";
import AppErrorModal from "./AppErrorModal";

const RouterCatcher = () => {
    const error = useRouteError();
    return <AppErrorModal error={error as Error} />;
};

export default RouterCatcher;
