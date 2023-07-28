import React, { Suspense } from "react";
import {
    Navigate,
    RouterProvider,
    createBrowserRouter,
} from "react-router-dom";
import ContentLoader from "../components/common/ContentLoader";
import { Text } from "@mantine/core";
import RouterCatcher from "../components/error-handling/RouterCatcher";

const ConversationPage = React.lazy(() => import("../pages/ConversationPage"));
const FunctionsRouter = React.lazy(() => import("./FunctionsRouter"));

const router = createBrowserRouter([
    { path: "/", element: <ConversationPage />, ErrorBoundary: RouterCatcher },
    {
        path: "/functions/*",
        element: <FunctionsRouter />,
        ErrorBoundary: RouterCatcher,
    },
    {
        path: "*",
        element: <Navigate to="" relative="route" />,
        ErrorBoundary: RouterCatcher,
    },
]);

const AppRouter = () => {
    return (
        <Suspense
            fallback={
                <ContentLoader size="xl">
                    <Text size="xl">
                        Loading{" "}
                        <Text
                            weight="bold"
                            span
                            variant="gradient"
                            gradient={{ from: "orange", to: "yellow.5" }}
                        >
                            GPT Turbo
                        </Text>
                    </Text>
                </ContentLoader>
            }
        >
            <RouterProvider router={router} />
        </Suspense>
    );
};

export default AppRouter;
