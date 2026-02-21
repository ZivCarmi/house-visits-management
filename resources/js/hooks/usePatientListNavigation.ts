import { useCallback } from "react";
import { router } from "@inertiajs/react";

export interface PatientListFilterParams {
    search?: string;
    sort_column?: string;
    sort_direction?: string;
    filter?: string;
}

export interface NavigateWithFiltersOptions {
    replace?: boolean;
}

/**
 * Encapsulates navigation to the patients list with query params.
 * Use replace: true for search debounce to avoid polluting history; replace: false for sort.
 */
export function usePatientListNavigation() {
    const navigateWithFilters = useCallback(
        (
            params: PatientListFilterParams,
            options?: NavigateWithFiltersOptions
        ) => {
            router.get("/patients", params, {
                preserveState: true,
                replace: options?.replace ?? false,
            });
        },
        []
    );

    return { navigateWithFilters };
}
