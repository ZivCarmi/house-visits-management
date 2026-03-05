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
        <div className="flex w-full flex-col gap-4 md:flex-row md:flex-wrap md:items-center md:justify-between">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
                <Input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder={SEARCH_PLACEHOLDER}
                    value={searchInput}
                    onChange={onSearchChange}
                    className="w-full md:w-[250px]"
                />
                <div
                    className={`flex gap-2 md:items-center ${isFilterActive ? "flex-row items-center" : "flex-col gap-3 md:flex-row"}`}
                >
                    <div className={isFilterActive ? "min-w-0 flex-1" : "w-full"}>
                        <PatientFilters filter={filter} onChange={setFilter} />
                    </div>
                    {isFilterActive && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setFilter("all")}
                            aria-label="איפוס סינון"
                            className="shrink-0"
                        >
                            איפוס
                            <X className="size-4" />
                        </Button>
                    )}
                </div>
            </div>
            <div className="w-full md:w-auto">
                {isVerified ? (
                    createButton
                ) : (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span className="inline-block w-full md:w-fit">
                                {createButton}
                            </span>
                        </TooltipTrigger>
                        <TooltipContent>{VERIFY_EMAIL_MESSAGE}</TooltipContent>
                    </Tooltip>
                )}
            </div>
        </div>
    );
}
