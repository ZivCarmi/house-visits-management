/**
 * Single source of truth for patient list sort column/direction:
 * types, defaults, validation, and parsing from URL params.
 */

export const PATIENT_SORT_COLUMNS = [
    "id",
    "last_visit_date",
    "next_visit_date",
] as const;

export type SortColumn = (typeof PATIENT_SORT_COLUMNS)[number];
export type SortDir = "asc" | "desc";

export const DEFAULT_SORT_COLUMN: SortColumn = "id";
export const DEFAULT_SORT_DIRECTION: SortDir = "desc";

export const SORT_COLUMN_ID = "id" as const;
export const SORT_COLUMN_LAST_VISIT = "last_visit_date" as const;
export const SORT_COLUMN_NEXT_VISIT = "next_visit_date" as const;

export function isSortColumn(v: string): v is SortColumn {
    return (PATIENT_SORT_COLUMNS as readonly string[]).includes(v);
}

export function isSortDir(v: string): v is SortDir {
    return v === "asc" || v === "desc";
}

export function parseSortParams(
    sort_column?: string,
    sort_direction?: string,
): { sortColumn: SortColumn; sortDir: SortDir } {
    const sortColumn = isSortColumn(sort_column ?? "")
        ? (sort_column as SortColumn)
        : DEFAULT_SORT_COLUMN;
    const dir = (sort_direction ?? DEFAULT_SORT_DIRECTION).toLowerCase();
    const sortDir: SortDir = isSortDir(dir) ? dir : DEFAULT_SORT_DIRECTION;
    return { sortColumn, sortDir };
}
