import React from "react";
import { createBrowserRouter } from "react-router";
import Loading from "../components/Loading/Loading.jsx";
import RootLayout from "../layouts/RootLayout.jsx";
import Home from "../pages/Home/Home.jsx";

const Router = createBrowserRouter([
    {
        path: "/",
        Component: RootLayout,
        hydrateFallbackElement: <Loading />,
        children: [
            {
                index: true,
                element: <Home />
            },
        ]
    },
]);

export default Router;