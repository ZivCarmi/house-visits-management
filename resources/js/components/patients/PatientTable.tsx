import type { Patient, PaginatedPatients } from "@/types/patient";
import { Button } from "@/components/ui/button";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
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

interface PatientTableProps {
    patients: PaginatedPatients;
    search?: string;
    sort_column?: string;
    sort_direction?: string;
    filter?: string;
    canEdit?: boolean;
}

export function PatientTable({
    patients,
    search = "",
    sort_column = DEFAULT_SORT_COLUMN,
    sort_direction = DEFAULT_SORT_DIRECTION,
    filter = "all",
    canEdit = true,
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
    const from = total > 0 ? (current_page - 1) * per_page + 1 : 0;
    const to = total > 0 ? Math.min(current_page * per_page, total) : 0;

    return (
        <div className="space-y-4">
            <DataTable<Patient, unknown>
                columns={getPatientColumns({
                    sortColumn,
                    sortDir,
                    onSort: handleSort,
                    editQueryString,
                    canEdit,
                })}
                data={patients.data}
                emptyMessage="לא נמצאו מטופלים."
            />
            {total > 0 && (
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm text-muted-foreground">
                        מציג {from}–{to} מתוך {total}
                    </p>
                    <Pagination className="mx-0 w-auto justify-start">
                        <PaginationContent>
                            <PaginationItem>
                                {prevLink?.url ? (
                                    <PaginationPrevious
                                        href={prevLink.url}
                                        text="הקודם"
                                    />
                                ) : (
                                    <Button
                                        variant="ghost"
                                        size="default"
                                        disabled
                                        className="gap-1 px-2.5 sm:ps-2.5"
                                    >
                                        <ChevronRightIcon />
                                        <span className="hidden sm:block">
                                            הקודם
                                        </span>
                                    </Button>
                                )}
                            </PaginationItem>
                            <PaginationItem>
                                <span className="px-2 text-sm text-muted-foreground">
                                    עמוד {current_page} מתוך {last_page}
                                </span>
                            </PaginationItem>
                            <PaginationItem>
                                {nextLink?.url ? (
                                    <PaginationNext
                                        href={nextLink.url}
                                        text="הבא"
                                    />
                                ) : (
                                    <Button
                                        variant="ghost"
                                        size="default"
                                        disabled
                                        className="gap-1 px-2.5 sm:pe-2.5"
                                    >
                                        <span className="hidden sm:block">
                                            הבא
                                        </span>
                                        <ChevronLeftIcon />
                                    </Button>
                                )}
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
        </div>
    );
}
