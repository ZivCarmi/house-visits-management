import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useOpenPatientCreateDialog } from "@/hooks/useOpenPatientCreateDialog";
import { usePatientFilters } from "@/hooks/usePatientFilters";
import { usePatientSearch } from "@/hooks/usePatientSearch";
import { usePage } from "@inertiajs/react";
import { Plus, X } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { PatientFilters } from "./PatientFilters";

const SEARCH_PLACEHOLDER = "חיפוש לפי ת.ז...";
const VERIFY_EMAIL_MESSAGE = "יש לאמת את האימייל כדי להוסיף מטופל";

export function PatientTableToolbar() {
    const { filter, setFilter } = usePatientFilters();
    const { searchInput, onSearchChange } = usePatientSearch();
    const openCreateDialog = useOpenPatientCreateDialog();
    const isFilterActive = filter !== "all";
    const user = usePage().props.auth?.user as
        | { email_verified_at?: string | null }
        | undefined;
    const isVerified = user?.email_verified_at != null;

    const createButton = (
        <Button
            type="button"
            onClick={isVerified ? openCreateDialog : undefined}
            disabled={!isVerified}
        >
            <Plus className="size-4" />
            מטופל חדש
        </Button>
    );

    return (
        <div className="flex w-full flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
                <Input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder={SEARCH_PLACEHOLDER}
                    value={searchInput}
                    onChange={onSearchChange}
                    className="min-w-64 max-w-md"
                />
                <PatientFilters filter={filter} onChange={setFilter} />
                {isFilterActive && (
                    <Button
                        type="button"
                        variant="ghost"
                        className=""
                        onClick={() => setFilter("all")}
                        aria-label="איפוס סינון"
                    >
                        איפוס
                        <X className="size-4" />
                    </Button>
                )}
            </div>
            {isVerified ? (
                createButton
            ) : (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span className="inline-block w-fit">
                            {createButton}
                        </span>
                    </TooltipTrigger>
                    <TooltipContent>{VERIFY_EMAIL_MESSAGE}</TooltipContent>
                </Tooltip>
            )}
        </div>
    );
}
