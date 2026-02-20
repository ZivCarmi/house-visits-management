import "./bootstrap";

import { createInertiaApp } from "@inertiajs/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "@/components/ui/sonner";
import { DirectionProvider } from "./components/ui/direction";

createInertiaApp({
    resolve: (name) => {
        const pages = import.meta.glob("./Pages/**/*.tsx", { eager: true });

        const page = pages[`./Pages/${name}.tsx`];

        if (!page) {
            throw new Error(`Inertia page "${name}" not found.`);
        }

        return page as never;
    },
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <StrictMode>
                <DirectionProvider dir="rtl">
                    <App {...props} />
                    <Toaster />
                </DirectionProvider>
            </StrictMode>,
        );
    },
    progress: {
        color: "#0f766e",
    },
});
