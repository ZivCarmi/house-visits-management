"use client";

import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    type ColumnDef,
    type OnChangeFn,
    type RowSelectionState,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useState } from "react";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    emptyMessage?: string;
    /** When provided, table is controlled (selection state lifted to parent) */
    rowSelection?: RowSelectionState;
    onRowSelectionChange?: OnChangeFn<RowSelectionState>;
    /** Return stable row id (e.g. patient.id) so selection keys are meaningful across pages */
    getRowId?: (row: TData) => string;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    emptyMessage = "לא נמצאו מטופלים.",
    rowSelection: controlledRowSelection,
    onRowSelectionChange: controlledOnRowSelectionChange,
    getRowId,
}: DataTableProps<TData, TValue>) {
    const [internalRowSelection, setInternalRowSelection] = useState<RowSelectionState>({});
    const isControlled = controlledRowSelection !== undefined && controlledOnRowSelectionChange !== undefined;
    const rowSelection = isControlled ? controlledRowSelection! : internalRowSelection;
    const setRowSelection: OnChangeFn<RowSelectionState> = isControlled
        ? controlledOnRowSelectionChange!
        : setInternalRowSelection;

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getRowId: getRowId
            ? (row: TData, index: number) => getRowId(row) ?? String(index)
            : undefined,
        onRowSelectionChange: setRowSelection,
        state: {
            rowSelection,
        },
    });

    return (
        <div className="overflow-hidden rounded-md border">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead
                                    key={header.id}
                                    className={
                                        (
                                            header.column.columnDef.meta as
                                            | { className?: string }
                                            | undefined
                                        )?.className
                                    }
                                >
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext(),
                                        )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={
                                    row.getIsSelected() ? "selected" : undefined
                                }
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell
                                        key={cell.id}
                                        className={
                                            (
                                                cell.column.columnDef.meta as
                                                | { className?: string }
                                                | undefined
                                            )?.className
                                        }
                                    >
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext(),
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                className="h-24 text-center"
                            >
                                {emptyMessage}
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
