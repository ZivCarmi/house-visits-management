import type { MouseEvent } from "react";
import { useForm } from "@inertiajs/react";
import { toasts } from "@/lib/toastMessages";
import type { FeedingType, FollowUpFrequency, Patient } from "@/types/patient";

export interface PatientFormData {
    full_name: string;
    id_number: string;
    address: string;
    phone: string;
    feeding_type: FeedingType;
    last_visit_date: string;
    followup_frequency: FollowUpFrequency;
    notes: string;
}

const defaultFormData: PatientFormData = {
    full_name: "",
    id_number: "",
    address: "",
    phone: "",
    feeding_type: "PO",
    last_visit_date: "",
    followup_frequency: "weekly",
    notes: "",
};

export function usePatientForm(patient?: Patient, onSuccess?: () => void) {
    const today = new Date().toISOString().slice(0, 10);
    const { data, setData, post, put, processing, errors } =
        useForm<PatientFormData>({
            full_name: patient?.full_name ?? "",
            id_number: patient?.id_number ?? "",
            address: patient?.address ?? "",
            phone: patient?.phone ?? "",
            feeding_type: patient?.feeding_type ?? "PO",
            last_visit_date: patient?.last_visit_date ?? today,
            followup_frequency: patient?.followup_frequency ?? "weekly",
            notes: patient?.notes ?? "",
        });

    const submit = (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        const queryString = window.location.search;
        const options = {
            onSuccess: () => {
                patient ? toasts.patient.updated() : toasts.patient.created();
                onSuccess?.();
            },
            onError: () => {
                patient
                    ? toasts.patient.updateFailed()
                    : toasts.patient.createFailed();
            },
        };
        if (patient) {
            put(`/patients/${patient.id}${queryString}`, options);
        } else {
            post(`/patients${queryString}`, options);
        }
    };

    const handleCancel = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        onSuccess?.();
    };

    return {
        data,
        setData,
        errors,
        processing,
        submit,
        handleCancel,
    };
}

export { defaultFormData };
