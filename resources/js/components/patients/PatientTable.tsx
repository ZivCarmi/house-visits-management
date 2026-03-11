import type { Patient, PaginatedPatients } from "@/types/patient";
import type { OnChangeFn, RowSelectionState } from "@tanstack/react-table";
import {
    DEFAULT_SORT_COLUMN,
    DEFAULT_SORT_DIRECTION,
    parseSortParams,
    type SortColumn,
    type SortDir,
} from "@/lib/patientSort";
import { usePatientListNavigation } from "@/hooks/usePatientListNavigation";
import { DataTable } from "./DataTable";
import { getPatientColumns } from "./columns";
import { TablePagination } from "./TablePagination";

interface PatientTableProps {
    patients: PaginatedPatients;
    search?: string;
    sort_column?: string;
    sort_direction?: string;
    filter?: string;
    canEdit?: boolean;
    onSchedule?: (patient: Patient) => void;
    rowSelection?: RowSelectionState;
    onRowSelectionChange?: OnChangeFn<RowSelectionState>;
    getRowId?: (row: Patient) => string;
}

export function PatientTable({
    patients,
    search = "",
    sort_column = DEFAULT_SORT_COLUMN,
    sort_direction = DEFAULT_SORT_DIRECTION,
    filter = "all",
    canEdit = true,
    onSchedule,
    rowSelection,
    onRowSelectionChange,
    getRowId,
}: PatientTableProps) {
    const { navigateWithFilters } = usePatientListNavigation();
    const { sortColumn, sortDir } = parseSortParams(
        sort_column,
        sort_direction,
    );

    const handleSort = (column: SortColumn, direction: SortDir) => {
        navigateWithFilters({
            sort_column: column,
            sort_direction: direction,
            ...(search ? { search } : {}),
            ...(filter !== "all" ? { filter } : {}),
        });
    };

    const links = patients.links;
    const prevLink = links[0];
    const nextLink = links[links.length - 1];
    const { total, current_page, last_page, per_page } = patients;

    const editQueryParams = new URLSearchParams();
    if (search) editQueryParams.set("search", search);
    if (sortColumn !== DEFAULT_SORT_COLUMN)
        editQueryParams.set("sort_column", sortColumn);
    if (sortDir !== DEFAULT_SORT_DIRECTION)
        editQueryParams.set("sort_direction", sortDir);
    if (filter !== "all") editQueryParams.set("filter", filter);
    if (current_page > 1) editQueryParams.set("page", String(current_page));
    const editQueryString = editQueryParams.toString();

    return (
        <div className="space-y-4">
            <DataTable<Patient, unknown>
                columns={getPatientColumns({
                    sortColumn,
                    sortDir,
                    onSort: handleSort,
                    editQueryString,
                    canEdit,
                    onSchedule,
                })}
                data={patients.data}
                emptyMessage="לא נמצאו מטופלים."
                rowSelection={rowSelection}
                onRowSelectionChange={onRowSelectionChange}
                getRowId={getRowId}
            />
            <TablePagination
                total={total}
                current_page={current_page}
                last_page={last_page}
                per_page={per_page}
                prevLink={prevLink}
                nextLink={nextLink}
            />
        </div>
    );
}
