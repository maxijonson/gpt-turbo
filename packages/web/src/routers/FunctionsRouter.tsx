import React, { Suspense } from "react";
import { Routes, Route, Navigate, useMatches } from "react-router-dom";
import ContentLoader from "../components/ContentLoader";
import { Text } from "@mantine/core";

const FunctionsPage = React.lazy(() => import("../pages/FunctionsPage"));
const FunctionEditorPage = React.lazy(
    () => import("../pages/FunctionEditorPage")
);

const PATH_INDEX = "";
const PATH_CREATE = "create";
const PATH_EDIT = "edit";

const FunctionsRouter = () => {
    const matches = useMatches();

    const loadingMessage = (() => {
        const path = matches[0].params["*"];
        if (path === PATH_INDEX) return "Loading Functions Library";
        if (path === PATH_CREATE) return "Loading Function Editor";
        if (path?.startsWith(PATH_EDIT)) return "Loading Function Editor";
        return "Loading Functions";
    })();

    return (
        <Suspense
            fallback={
                <ContentLoader size="xl">
                    <Text size="xl">{loadingMessage}</Text>
                </ContentLoader>
            }
        >
            <Routes>
                <Route index element={<FunctionsPage />} />
                <Route path={PATH_CREATE} element={<FunctionEditorPage />} />
                <Route
                    path={`${PATH_EDIT}/:id`}
                    element={<FunctionEditorPage />}
                />
                <Route path="*" element={<Navigate to="" relative="route" />} />
            </Routes>
        </Suspense>
    );
};

export default FunctionsRouter;
