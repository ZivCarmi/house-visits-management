import { router } from "@inertiajs/react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePatientFilters } from "@/hooks/usePatientFilters";
import { PatientFilters } from "./PatientFilters";

export function PatientTableToolbar() {
    const { filter, setFilter } = usePatientFilters();

    const handleCreateClick = () => {
        const currentParams = new URLSearchParams(window.location.search);
        currentParams.set("create", "1");
        router.get(
            `/patients?${currentParams.toString()}`,
            {},
            { preserveState: true },
        );
    };

    return (
        <div className="flex w-full flex-wrap items-center justify-between gap-4">
            <PatientFilters filter={filter} onChange={setFilter} />
            <Button type="button" onClick={handleCreateClick}>
                <Plus className="size-4" />
                מטופל חדש
            </Button>
        </div>
    );
}
