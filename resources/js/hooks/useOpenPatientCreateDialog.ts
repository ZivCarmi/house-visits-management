import { useCallback } from "react";
import { router } from "@inertiajs/react";

/**
 * Returns a function that opens the create-patient dialog by navigating to the
 * current patients URL with create=1 (preserves search, sort, etc.).
 */
export function useOpenPatientCreateDialog() {
    return useCallback(() => {
        const params = new URLSearchParams(window.location.search);
        params.set("create", "1");
        router.get(`/patients?${params.toString()}`, {}, { preserveState: true });
    }, []);
}
