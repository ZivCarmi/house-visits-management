import { useEffect, useRef, useState } from "react";
import { usePage } from "@inertiajs/react";
import { usePatientListNavigation } from "@/hooks/usePatientListNavigation";
import { digitsOnly } from "@/lib/utils";

const SORT_COLUMNS = ["last_visit_date", "next_visit_date"] as const;
type SortColumn = (typeof SORT_COLUMNS)[number];
type SortDir = "asc" | "desc";

function isSortColumn(v: string): v is SortColumn {
    return SORT_COLUMNS.includes(v as SortColumn);
}

type PatientListPageProps = {
    search?: string;
    sort_column?: string;
    sort_direction?: string;
    filter?: string;
};

const DEBOUNCE_MS = 400;

/**
 * Manages search-by-ID input: local state, sync from URL, debounced navigation.
 */
export function usePatientSearch() {
    const { navigateWithFilters } = usePatientListNavigation();
    const props = usePage().props as PatientListPageProps;
    const search = props.search ?? "";
    const sort_column = props.sort_column ?? "next_visit_date";
    const sort_direction = props.sort_direction ?? "desc";
    const filter = props.filter ?? "all";

    const [searchInput, setSearchInput] = useState(() => digitsOnly(search));
    const lastSentSearch = useRef(digitsOnly(search));
    const sortColumn = isSortColumn(sort_column) ? sort_column : "next_visit_date";
    const sortDir: SortDir =
        sort_direction === "asc" || sort_direction === "desc"
            ? sort_direction
            : "desc";

    useEffect(() => {
        const raw = digitsOnly(search);
        setSearchInput(raw);
        lastSentSearch.current = raw;
    }, [search]);

    useEffect(() => {
        const raw = digitsOnly(searchInput);
        if (raw === lastSentSearch.current) return;
        const t = setTimeout(() => {
            lastSentSearch.current = raw;
            navigateWithFilters(
                {
                    sort_column: sortColumn,
                    sort_direction: sortDir,
                    filter,
                    ...(raw ? { search: raw } : {}),
                },
                { replace: true },
            );
        }, DEBOUNCE_MS);
        return () => clearTimeout(t);
    }, [searchInput, sortColumn, sortDir, filter, navigateWithFilters]);

    const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(digitsOnly(e.target.value));
    };

    return { searchInput, onSearchChange };
}
