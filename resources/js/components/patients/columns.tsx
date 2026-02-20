"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Link, router } from "@inertiajs/react";
import { useState } from "react";
import { toasts } from "@/lib/toastMessages";
import {
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    CopyIcon,
    MoreHorizontal,
    PencilIcon,
    TrashIcon,
} from "lucide-react";
import type { Patient } from "@/types/patient";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FOLLOWUP_FREQUENCY_LABELS } from "@/lib/patientLabels";
import { formatDate, isOverdue } from "@/utils/dateHelpers";

const SORTABLE_LAST_VISIT = "last_visit_date";
const SORTABLE_NEXT_VISIT = "next_visit_date";
type SortColumn = typeof SORTABLE_LAST_VISIT | typeof SORTABLE_NEXT_VISIT;
type SortDir = "asc" | "desc";

function SortableHeader({
    label,
    columnId,
    currentSortColumn,
    currentSortDir,
    onSort,
}: {
    label: string;
    columnId: SortColumn;
    currentSortColumn: SortColumn;
    currentSortDir: SortDir;
    onSort: (column: SortColumn, dir: SortDir) => void;
}) {
    const isActive = currentSortColumn === columnId;
    const nextDir: SortDir =
        isActive && currentSortDir === "desc" ? "asc" : "desc";
    return (
        <Button
            variant="ghost"
            size="sm"
            className="-ms-2 h-8"
            onClick={() => onSort(columnId, nextDir)}
        >
            {label}
            {isActive ? (
                currentSortDir === "desc" ? (
                    <ArrowDown className="ms-2 size-4" />
                ) : (
                    <ArrowUp className="ms-2 size-4" />
                )
            ) : (
                <ArrowUpDown className="ms-2 size-4 opacity-50" />
            )}
        </Button>
    );
}

function ActionsCell({
    patient,
    editQueryString,
}: {
    patient: Patient;
    editQueryString: string;
}) {
    const [deleteOpen, setDeleteOpen] = useState(false);
    const copyId = () => {
        navigator.clipboard.writeText(patient.id_number);
    };
    const handleDelete = () => {
        router.delete(`/patients/${patient.id}`, {
            preserveScroll: true,
            onSuccess: () => toasts.patient.deleted(),
            onError: () => toasts.patient.deleteFailed(),
        });
    };
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        aria-label="פתח תפריט"
                    >
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuGroup>
                        <DropdownMenuItem asChild>
                            <Link
                                href={`/patients/${patient.id}/edit${editQueryString ? `?${editQueryString}` : ""}`}
                                preserveScroll
                            >
                                <PencilIcon />
                                עריכה
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={copyId}>
                            <CopyIcon />
                            העתקת ת.ז.
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        variant="destructive"
                        onClick={(e) => {
                            e.preventDefault();
                            setDeleteOpen(true);
                        }}
                    >
                        <TrashIcon />
                        מחיקה
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>מחיקת מטופל</AlertDialogTitle>
                        <AlertDialogDescription>
                            האם למחוק את המטופל? לא ניתן לשחזר פעולה זו.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>ביטול</AlertDialogCancel>
                        <AlertDialogAction
                            variant="destructive"
                            onClick={handleDelete}
                        >
                            מחיקה
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

export interface PatientTableSortProps {
    sortColumn: SortColumn;
    sortDir: SortDir;
    onSort: (column: SortColumn, dir: SortDir) => void;
    editQueryString: string;
}

export function getPatientColumns({
    sortColumn,
    sortDir,
    onSort,
    editQueryString,
}: PatientTableSortProps): ColumnDef<Patient>[] {
    return [
        {
            accessorKey: "full_name",
            header: "שם",
            cell: ({ row }) => row.original.full_name,
        },
        {
            accessorKey: "id_number",
            header: "ת.ז.",
        },
        {
            accessorKey: "address",
            header: "כתובת",
        },
        {
            accessorKey: "phone",
            header: "טלפון",
        },
        {
            accessorKey: "feeding_type",
            header: "הזנה",
        },
        {
            accessorKey: SORTABLE_LAST_VISIT,
            header: () => (
                <SortableHeader
                    label="ביקור אחרון"
                    columnId={SORTABLE_LAST_VISIT}
                    currentSortColumn={sortColumn}
                    currentSortDir={sortDir}
                    onSort={onSort}
                />
            ),
            cell: ({ row }) => formatDate(row.original.last_visit_date),
        },
        {
            accessorKey: SORTABLE_NEXT_VISIT,
            header: () => (
                <SortableHeader
                    label="ביקור הבא"
                    columnId={SORTABLE_NEXT_VISIT}
                    currentSortColumn={sortColumn}
                    currentSortDir={sortDir}
                    onSort={onSort}
                />
            ),
            cell: ({ row }) => formatDate(row.original.next_visit_date),
        },
        {
            accessorKey: "followup_frequency",
            header: "תדירות",
            cell: ({ row }) =>
                FOLLOWUP_FREQUENCY_LABELS[row.original.followup_frequency],
        },
        {
            id: "status",
            header: "סטטוס",
            cell: ({ row }) => {
                const next = row.original.next_visit_date;
                if (!next) return "-";
                return isOverdue(next) ? "באיחור" : "מתוכנן";
            },
        },
        {
            id: "actions",
            header: () => <span className="sr-only">פעולות</span>,
            cell: ({ row }) => (
                <ActionsCell
                    patient={row.original}
                    editQueryString={editQueryString}
                />
            ),
        },
    ];
}
