import * as React from "react";
import { Link } from "@inertiajs/react";
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    MoreHorizontalIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants, type Button } from "@/components/ui/button";
import { useDirection } from "@/components/ui/direction";

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
    return (
        <nav
            role="navigation"
            aria-label="pagination"
            data-slot="pagination"
            className={cn("mx-auto flex w-full justify-center", className)}
            {...props}
        />
    );
}

function PaginationContent({
    className,
    ...props
}: React.ComponentProps<"ul">) {
    return (
        <ul
            data-slot="pagination-content"
            className={cn("flex flex-row items-center gap-1", className)}
            {...props}
        />
    );
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
    return <li data-slot="pagination-item" {...props} />;
}

type PaginationLinkProps = {
    isActive?: boolean;
    size?: React.ComponentProps<typeof Button>["size"];
} & Omit<React.ComponentProps<typeof Link>, "size">;

function PaginationLink({
    className,
    isActive,
    size = "icon",
    ...props
}: PaginationLinkProps) {
    return (
        <Link
            aria-current={isActive ? "page" : undefined}
            data-slot="pagination-link"
            data-active={isActive}
            preserveScroll
            className={cn(
                buttonVariants({
                    variant: isActive ? "outline" : "ghost",
                    size,
                }),
                className,
            )}
            {...props}
        />
    );
}

type PaginationPreviousProps = Omit<
    React.ComponentProps<typeof PaginationLink>,
    "children"
> & { text?: string };

function PaginationPrevious({
    className,
    text = "Previous",
    ...props
}: PaginationPreviousProps) {
    const dir = useDirection();
    const isRtl = dir === "rtl";
    return (
        <PaginationLink
            aria-label="Go to previous page"
            size="default"
            className={cn("gap-1 px-2.5 sm:ps-2.5", className)}
            {...props}
        >
            {isRtl ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            <span className="hidden sm:block">{text}</span>
        </PaginationLink>
    );
}

type PaginationNextProps = Omit<
    React.ComponentProps<typeof PaginationLink>,
    "children"
> & { text?: string };

function PaginationNext({
    className,
    text = "Next",
    ...props
}: PaginationNextProps) {
    const dir = useDirection();
    const isRtl = dir === "rtl";
    return (
        <PaginationLink
            aria-label="Go to next page"
            size="default"
            className={cn("gap-1 px-2.5 sm:pe-2.5", className)}
            {...props}
        >
            <span className="hidden sm:block">{text}</span>
            {isRtl ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </PaginationLink>
    );
}

function PaginationEllipsis({
    className,
    ...props
}: React.ComponentProps<"span">) {
    return (
        <span
            aria-hidden
            data-slot="pagination-ellipsis"
            className={cn("flex size-9 items-center justify-center", className)}
            {...props}
        >
            <MoreHorizontalIcon className="size-4" />
            <span className="sr-only">More pages</span>
        </span>
    );
}

export {
    Pagination,
    PaginationContent,
    PaginationLink,
    PaginationItem,
    PaginationPrevious,
    PaginationNext,
    PaginationEllipsis,
};
