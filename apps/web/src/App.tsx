import { RouterProvider } from "@tanstack/react-router";
import type React from "react";
import { StudioProvider } from "./context/studio-context.js";
import { router } from "./router.js";

export function App(): React.JSX.Element {
  return (
    <StudioProvider>
      <RouterProvider router={router} />
    </StudioProvider>
  );
}
