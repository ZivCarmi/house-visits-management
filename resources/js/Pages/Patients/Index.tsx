import { Head, router } from "@inertiajs/react";
import type { Patient, PaginatedPatients } from "@/types/patient";
import { AppLayout } from "@/Layouts/AppLayout";
import { PatientTable } from "@/components/patients/PatientTable";
import { PatientTableToolbar } from "@/components/patients/PatientTableToolbar";
import { PatientDialog } from "@/components/patients/PatientDialog";

type PatientsPageProps = {
    patients: PaginatedPatients;
    openCreateDialog?: boolean;
    openEditDialog?: boolean;
    editPatient?: Patient;
    search?: string;
    sort_column?: string;
    sort_direction?: string;
};

const DEFAULT_SORT_COLUMN = "next_visit_date";
const DEFAULT_SORT_DIRECTION = "desc";

export default function Index({
    patients,
    openCreateDialog = false,
    openEditDialog = false,
    editPatient,
    search,
    sort_column,
    sort_direction,
}: PatientsPageProps) {
    const dialogOpen = openCreateDialog || (openEditDialog && !!editPatient);

    const onCloseDialog = () => {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (sort_column && sort_column !== DEFAULT_SORT_COLUMN)
            params.set("sort_column", sort_column);
        if (sort_direction && sort_direction !== DEFAULT_SORT_DIRECTION)
            params.set("sort_direction", sort_direction);
        if (patients.current_page > 1)
            params.set("page", String(patients.current_page));
        const q = params.toString();
        router.visit(q ? `/patients?${q}` : "/patients", { replace: true });
    };

    return (
        <AppLayout>
            <Head title="מטופלים" />

            <div className="flex flex-col gap-4">
                <PatientTableToolbar />
                <PatientTable
                    patients={patients}
                    search={search}
                    sort_column={sort_column}
                    sort_direction={sort_direction}
                />
            </div>

            <PatientDialog
                open={dialogOpen}
                patient={editPatient}
                onClose={onCloseDialog}
            />
        </AppLayout>
    );
}
