import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PatientDialog } from "@/components/patients/PatientDialog";
import { PatientTable } from "@/components/patients/PatientTable";
import { PatientTableToolbar } from "@/components/patients/PatientTableToolbar";
import { DEFAULT_SORT_COLUMN, DEFAULT_SORT_DIRECTION } from "@/lib/patientSort";
import type { PaginatedPatients, Patient } from "@/types/patient";
import { Head, router, usePage } from "@inertiajs/react";

type PatientsPageProps = {
    patients: PaginatedPatients;
    openCreateDialog?: boolean;
    openEditDialog?: boolean;
    editPatient?: Patient;
    search?: string;
    sort_column?: string;
    sort_direction?: string;
    filter?: string;
};

const DEFAULT_FILTER = "all";

export default function Index({
    patients,
    openCreateDialog = false,
    openEditDialog = false,
    editPatient,
    search,
    sort_column,
    sort_direction,
    filter = DEFAULT_FILTER,
}: PatientsPageProps) {
    const user = usePage().props.auth?.user as
        | { email_verified_at?: string | null }
        | undefined;
    const canEdit = user?.email_verified_at != null;
    const dialogOpen = openCreateDialog || (openEditDialog && !!editPatient);

    const onCloseDialog = () => {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (sort_column && sort_column !== DEFAULT_SORT_COLUMN)
            params.set("sort_column", sort_column);
        if (sort_direction && sort_direction !== DEFAULT_SORT_DIRECTION)
            params.set("sort_direction", sort_direction);
        if (filter && filter !== DEFAULT_FILTER) params.set("filter", filter);
        if (patients.current_page > 1)
            params.set("page", String(patients.current_page));
        const q = params.toString();
        router.visit(q ? `/patients?${q}` : "/patients", { replace: true });
    };

    return (
        <AuthenticatedLayout>
            <Head title="מטופלים" />

            <div className="flex flex-col gap-4">
                <PatientTableToolbar />
                <PatientTable
                    patients={patients}
                    search={search}
                    sort_column={sort_column}
                    sort_direction={sort_direction}
                    filter={filter}
                    canEdit={canEdit}
                />
            </div>

            <PatientDialog
                open={dialogOpen}
                patient={editPatient}
                onClose={onCloseDialog}
            />
        </AuthenticatedLayout>
    );
}
