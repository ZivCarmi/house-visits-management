import { useEffect, useRef, useState } from "react";
import { usePage } from "@inertiajs/react";
import { usePatientListNavigation } from "@/hooks/usePatientListNavigation";
import { parseSortParams } from "@/lib/patientSort";
import { digitsOnly } from "@/lib/utils";

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
    const filter = props.filter ?? "all";
    const { sortColumn, sortDir } = parseSortParams(
        props.sort_column,
        props.sort_direction,
    );

    const [searchInput, setSearchInput] = useState(() => digitsOnly(search));
    const lastSentSearch = useRef(digitsOnly(search));

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
