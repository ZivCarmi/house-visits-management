import "./bootstrap";

import { Toaster } from "@/components/ui/sonner";
import { createInertiaApp } from "@inertiajs/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "./components/ui/theme-provider";
import { DirectionProvider } from "./components/ui/direction";
import { TooltipProvider } from "./components/ui/tooltip";

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
                <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                    <DirectionProvider dir="rtl">
                        <TooltipProvider>
                            <App {...props} />
                        </TooltipProvider>
                        <Toaster />
                    </DirectionProvider>
                </ThemeProvider>
            </StrictMode>,
        );
    },
    progress: {
        color: "#ff6900",
    },
});
