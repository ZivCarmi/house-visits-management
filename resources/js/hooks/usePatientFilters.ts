import { useMemo, useState } from 'react';

export type VisitFilter = 'all' | 'weekly' | 'monthly' | 'overdue';

interface UsePatientFiltersOptions {
    initialFilter?: VisitFilter;
}

export function usePatientFilters(options: UsePatientFiltersOptions = {}) {
    const [filter, setFilter] = useState<VisitFilter>(options.initialFilter ?? 'all');

    const queryParams = useMemo(() => {
        const params = new URLSearchParams();

        if (filter !== 'all') {
            params.set('filter', filter);
        }

        return params.toString();
    }, [filter]);

    return {
        filter,
        setFilter,
        queryParams,
    };
}

