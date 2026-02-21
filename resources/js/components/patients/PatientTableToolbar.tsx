import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePatientFilters } from "@/hooks/usePatientFilters";
import { useOpenPatientCreateDialog } from "@/hooks/useOpenPatientCreateDialog";
import { usePatientSearch } from "@/hooks/usePatientSearch";
import { PatientFilters } from "./PatientFilters";

const SEARCH_PLACEHOLDER = "חיפוש לפי ת.ז...";

export function PatientTableToolbar() {
    const { filter, setFilter } = usePatientFilters();
    const { searchInput, onSearchChange } = usePatientSearch();
    const openCreateDialog = useOpenPatientCreateDialog();

    return (
        <div className="flex w-full flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
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
            </div>
            <Button type="button" onClick={openCreateDialog}>
                <Plus className="size-4" />
                מטופל חדש
            </Button>
        </div>
    );
}
