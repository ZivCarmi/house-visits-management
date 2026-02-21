import { useCallback } from "react";
import { usePage } from "@inertiajs/react";
import { usePatientListNavigation } from "@/hooks/usePatientListNavigation";

export type VisitFilter = "all" | "weekly" | "monthly" | "overdue";

type PatientListPageProps = {
    search?: string;
    sort_column?: string;
    sort_direction?: string;
    filter?: string;
};

const VALID_FILTERS: VisitFilter[] = ["all", "weekly", "monthly", "overdue"];

function parseFilter(value: string | undefined): VisitFilter {
    if (value != null && VALID_FILTERS.includes(value as VisitFilter)) {
        return value as VisitFilter;
    }

    return "all";
}

/**
 * Visit filter driven by URL. Reads filter from page props; changing it navigates with the new filter while preserving search and sort.
 */
export function usePatientFilters() {
    const { navigateWithFilters } = usePatientListNavigation();
    const props = usePage().props as PatientListPageProps;

    const filter = parseFilter(props.filter);

    const setFilter = useCallback(
        (nextFilter: VisitFilter) => {
            navigateWithFilters({
                filter: nextFilter,
                search: props.search,
                sort_column: props.sort_column,
                sort_direction: props.sort_direction,
            });
        },
        [
            navigateWithFilters,
            props.search,
            props.sort_column,
            props.sort_direction,
        ],
    );

    return { filter, setFilter };
}
