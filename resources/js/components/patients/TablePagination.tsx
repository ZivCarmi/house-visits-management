import type { PaginationLink } from "@/types/patient";
import { Button } from "@/components/ui/button";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

export interface TablePaginationProps {
    total: number;
    current_page: number;
    last_page: number;
    per_page: number;
    prevLink: PaginationLink | undefined;
    nextLink: PaginationLink | undefined;
}

export function TablePagination({
    total,
    current_page,
    last_page,
    per_page,
    prevLink,
    nextLink,
}: TablePaginationProps) {
    if (total === 0) {
        return null;
    }

    const from = (current_page - 1) * per_page + 1;
    const to = Math.min(current_page * per_page, total);

    return (
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
    );
}
