import { usePage } from "@inertiajs/react";

/**
 * Single place to access shared Inertia page data (auth, flash, etc.).
 * Use only from Page components or from hooks that need shared Inertia data.
 * Extend the return type when the backend adds auth or flash to shared props.
 */
export function useAppPage() {
    return usePage().props;
}
