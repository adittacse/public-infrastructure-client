import React from "react";
import { createBrowserRouter } from "react-router";
import Loading from "../components/Loading/Loading.jsx";

const Router = createBrowserRouter([
    {
        path: "/",
        element: <div>Hello World</div>,
        hydrateFallbackElement: <Loading />,
        children: [

        ]
    },
]);

export default Router;