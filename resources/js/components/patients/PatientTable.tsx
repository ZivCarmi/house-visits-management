import { useEffect, useRef, useState } from "react";
import type { Patient, PaginatedPatients } from "@/types/patient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { digitsOnly } from "@/lib/utils";

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
}

export function PatientTable({
    patients,
    search = "",
    sort_column = "next_visit_date",
    sort_direction = "desc",
}: PatientTableProps) {
    const { navigateWithFilters } = usePatientListNavigation();

    const [searchInput, setSearchInput] = useState(() => digitsOnly(search));
    const lastSentSearch = useRef(digitsOnly(search));
    const sortColumn = isSortColumn(sort_column)
        ? sort_column
        : "next_visit_date";
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
                    ...(raw ? { search: raw } : {}),
                },
                { replace: true },
            );
        }, 400);
        return () => clearTimeout(t);
    }, [searchInput, sortColumn, sortDir, navigateWithFilters]);

    const handleSort = (column: SortColumn, direction: SortDir) => {
        navigateWithFilters({
            sort_column: column,
            sort_direction: direction,
            ...(search ? { search } : {}),
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
    if (current_page > 1) editQueryParams.set("page", String(current_page));
    const editQueryString = editQueryParams.toString();
    const from = total > 0 ? (current_page - 1) * per_page + 1 : 0;
    const to = total > 0 ? Math.min(current_page * per_page, total) : 0;

    return (
        <div className="space-y-4">
            <div className="flex items-center py-2">
                <Input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="חיפוש לפי ת.ז. (ספרות בלבד)..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(digitsOnly(e.target.value))}
                    className="max-w-sm"
                />
            </div>
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
