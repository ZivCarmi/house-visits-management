import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PatientDialog } from "@/components/patients/PatientDialog";
import { PatientTable } from "@/components/patients/PatientTable";
import { PatientTableToolbar } from "@/components/patients/PatientTableToolbar";
import { PatientsMapDialog } from "@/components/patients/PatientsMapDialog";
import ScheduleVisitDialog from "@/components/patients/ScheduleVisitDialog";
import { toasts } from "@/lib/toastMessages";
import { DEFAULT_SORT_COLUMN, DEFAULT_SORT_DIRECTION } from "@/lib/patientSort";
import type { PaginatedPatients, Patient } from "@/types/patient";
import { Head, router, usePage } from "@inertiajs/react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { RowSelectionState } from "@tanstack/react-table";

type PatientsPageProps = {
    patients: PaginatedPatients;
    openCreateDialog?: boolean;
    openEditDialog?: boolean;
    editPatient?: Patient;
    openScheduleDialog?: boolean;
    schedulePatient?: Patient;
    search?: string;
    sort_column?: string;
    sort_direction?: string;
    filter?: string;
    googleMapsApiKey?: string | null;
};

const DEFAULT_FILTER = "all";

export default function Index({
    patients,
    openCreateDialog = false,
    openEditDialog = false,
    editPatient,
    openScheduleDialog = false,
    schedulePatient,
    search,
    sort_column,
    sort_direction,
    filter = DEFAULT_FILTER,
}: PatientsPageProps) {
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const [mapDialogOpen, setMapDialogOpen] = useState(false);

    const selectedIds = useMemo(
        () =>
            Object.keys(rowSelection)
                .filter((key) => rowSelection[key])
                .map(Number)
                .filter((id) => Number.isInteger(id) && id > 0),
        [rowSelection]
    );

    const pageProps = usePage().props as {
        auth?: { user?: { email_verified_at?: string | null } };
        flash?: { success_bulk_count?: number };
    };
    const user = pageProps.auth?.user as
        | { email_verified_at?: string | null }
        | undefined;
    const canEdit = user?.email_verified_at != null;
    const dialogOpen = openCreateDialog || (openEditDialog && !!editPatient);

    useEffect(() => {
        const count = pageProps.flash?.success_bulk_count;
        if (count != null && count > 0) {
            if (count === 1) {
                toasts.patient.created();
            } else {
                toast.success(`נוספו ${count} מטופלים.`);
            }
        }
    }, [pageProps.flash?.success_bulk_count]);
    const scheduleDialogOpen = openScheduleDialog && !!schedulePatient;

    const handleSchedule = (patient: Patient) => {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (sort_column && sort_column !== DEFAULT_SORT_COLUMN)
            params.set("sort_column", sort_column);
        if (sort_direction && sort_direction !== DEFAULT_SORT_DIRECTION)
            params.set("sort_direction", sort_direction);
        if (filter && filter !== DEFAULT_FILTER) params.set("filter", filter);
        if (patients.current_page > 1)
            params.set("page", String(patients.current_page));
        params.set("schedule", String(patient.id));
        const q = params.toString();
        router.visit(`/patients?${q}`, { preserveScroll: true });
    };

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
                <PatientTableToolbar
                    selectedCount={selectedIds.length}
                    onShowMap={() => setMapDialogOpen(true)}
                />
                <PatientTable
                    patients={patients}
                    search={search}
                    sort_column={sort_column}
                    sort_direction={sort_direction}
                    filter={filter}
                    canEdit={canEdit}
                    onSchedule={handleSchedule}
                    rowSelection={rowSelection}
                    onRowSelectionChange={setRowSelection}
                    getRowId={(row) => String(row.id)}
                />
            </div>

            <PatientDialog
                open={dialogOpen}
                patient={editPatient}
                onClose={onCloseDialog}
            />

            <ScheduleVisitDialog
                open={scheduleDialogOpen}
                onClose={onCloseDialog}
                patient={schedulePatient ?? null}
            />

            <PatientsMapDialog
                open={mapDialogOpen}
                onClose={() => setMapDialogOpen(false)}
                patientIds={selectedIds}
            />
        </AuthenticatedLayout>
    );
}
