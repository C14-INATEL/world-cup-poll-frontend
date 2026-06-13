import { createRoot } from "react-dom/client";
import { Toaster } from "sonner";

import { AppProviders } from "@/app/providers/app-providers";
import "@/app/styles/global.css";
import { AppRouter } from "./routes/app-router";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
    <AppProviders>
      <Toaster
        position="top-right"
        richColors={true}
        mobileOffset={8}
      />
      <AppRouter />
    </AppProviders>
);
