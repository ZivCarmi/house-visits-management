import type { Patient } from "@/types/patient";
import { router, usePage } from "@inertiajs/react";
import { addHours, format, formatDate } from "date-fns";
import { he } from "date-fns/locale";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

function timePlusOneHour(timeStr: string): string {
    const [hours, minutes] = timeStr.split(":").map(Number);
    const base = new Date(2000, 0, 1, hours, minutes);
    return format(addHours(base, 1), "HH:mm");
}

export function useScheduleVisitForm(
    patient: Patient | null,
    open: boolean,
    onSuccess: () => void,
) {
    const { flash } = usePage().props;
    const [visitDate, setVisitDate] = useState<Date | undefined>(undefined);
    const [startTime, setStartTime] = useState("09:00");
    const [endTime, setEndTime] = useState("10:00");
    const [notes, setNotes] = useState("");
    const [colorId, setColorId] = useState<number>(9);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (open && patient) {
            const now = new Date();
            setVisitDate(now);
            setStartTime("09:00");
            setEndTime("10:00");
            setNotes("");
            setColorId(9);
            setErrors({});
        }
    }, [open, patient]);

    useEffect(() => {
        if (flash?.eventHtmlLink) {
            toast.success("האירוע נוסף ליומן Google בהצלחה", {
                description: `${formatDate(
                    visitDate || new Date(),
                    "EEEE, d.M.yyyy",
                    { locale: he },
                )}, ${startTime}-${endTime}`,
                action: {
                    label: "פתח ביומן",
                    onClick: () => window.open(flash.eventHtmlLink, "_blank"),
                },
                duration: 10000,
            });
        }
    }, [flash?.eventHtmlLink]);

    const setStartTimeAndEnd = useCallback((value: string) => {
        setStartTime(value);
        setEndTime(timePlusOneHour(value));
    }, []);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!patient || !visitDate) return;

        const startDateTimeStr = `${format(visitDate, "yyyy-MM-dd")} ${startTime}`;
        const endDateTimeStr = `${format(visitDate, "yyyy-MM-dd")} ${endTime}`;

        setProcessing(true);
        router.post(
            "/google-calendar/events",
            {
                patient_id: patient.id,
                start_datetime: startDateTimeStr,
                end_datetime: endDateTimeStr,
                notes,
                color_id: colorId,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    onSuccess();
                },
                onError: (errors) => {
                    setErrors(errors);
                    const firstError = Object.values(errors)[0];
                    toast.error(firstError || "יצירת האירוע נכשלה. נסה שוב.");
                },
                onFinish: () => setProcessing(false),
            },
        );
    };

    return {
        visitDate,
        setVisitDate,
        startTime,
        setStartTime: setStartTimeAndEnd,
        endTime,
        setEndTime,
        notes,
        setNotes,
        colorId,
        setColorId,
        errors,
        processing,
        submit,
    };
}
