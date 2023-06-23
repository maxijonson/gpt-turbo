import React, { Suspense } from "react";
import {
    Route,
    RouterProvider,
    createBrowserRouter,
    createRoutesFromElements,
} from "react-router-dom";
import ContentLoader from "../components/ContentLoader";
import { Text } from "@mantine/core";

const ConversationPage = React.lazy(() => import("../pages/ConversationPage"));

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route path="/" element={<ConversationPage />} />
        </>
    )
);

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
