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
import { DataTable } from "./DataTable";
import { getPatientColumns } from "./columns";
import { usePatientListNavigation } from "@/hooks/usePatientListNavigation";

const SORT_COLUMNS = ["last_visit_date", "next_visit_date"] as const;
type SortColumn = (typeof SORT_COLUMNS)[number];
type SortDir = "asc" | "desc";

function isSortColumn(v: string): v is SortColumn {
    return SORT_COLUMNS.includes(v as SortColumn);
}

interface PatientTableProps {
    patients: PaginatedPatients;
    search?: string;
    sort_column?: string;
    sort_direction?: string;
    filter?: string;
}

export function PatientTable({
    patients,
    search = "",
    sort_column = "next_visit_date",
    sort_direction = "desc",
    filter = "all",
}: PatientTableProps) {
    const { navigateWithFilters } = usePatientListNavigation();

    const sortColumn = isSortColumn(sort_column)
        ? sort_column
        : "next_visit_date";
    const sortDir: SortDir =
        sort_direction === "asc" || sort_direction === "desc"
            ? sort_direction
            : "desc";

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
    if (sortColumn !== "next_visit_date")
        editQueryParams.set("sort_column", sortColumn);
    if (sortDir !== "desc")
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
