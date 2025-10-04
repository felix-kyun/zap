import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "@routes/router";
import { CustomToast } from "@components/CustomToast";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <CustomToast />
        <RouterProvider router={router} />
    </StrictMode>,
);
