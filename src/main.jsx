import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router/dom";
import Router from "./Routes/Router.jsx";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import AuthProvider from "./Contexts/AuthContexts/AuthProvider.jsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <RouterProvider router={Router} />
            </AuthProvider>
        </QueryClientProvider>
    </StrictMode>,
)
