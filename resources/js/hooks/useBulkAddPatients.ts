import type { PatientFormData } from "@/hooks/usePatientForm";
import { defaultFormData } from "@/hooks/usePatientForm";
import { useForm } from "@inertiajs/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

const MAX_DRAFTS = 5;

const DUPLICATE_ID_MESSAGE = "מספר תעודת זהות זהה למטופל מספר ";

export interface Draft {
    id: string;
    data: PatientFormData;
}

type BulkPatientFormData = Draft[];

type FieldErrors = Partial<Record<keyof PatientFormData, string>>;
type AllDraftErrors = Record<string, FieldErrors>;

function generateDraftId(): string {
    return `draft-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function isFormFilled(data: PatientFormData): boolean {
    return Boolean(
        data.full_name?.trim() ||
        data.id_number?.trim() ||
        data.address?.trim() ||
        data.phone?.trim(),
    );
}

function getDefaultFormData(): PatientFormData {
    const today = new Date().toISOString().slice(0, 10);
    return { ...defaultFormData, last_visit_date: today };
}

function createDraft(): Draft {
    return { id: generateDraftId(), data: getDefaultFormData() };
}

function findDuplicateIdError(
    drafts: Draft[],
    activeDraftId: string,
    idNumber: string,
): string | null {
    const trimmed = idNumber?.trim() ?? "";
    if (!trimmed) return null;
    const otherIndex = drafts.findIndex(
        (d) =>
            d.id !== activeDraftId &&
            (d.data.id_number?.trim() ?? "") === trimmed,
    );
    if (otherIndex === -1) return null;
    return `${DUPLICATE_ID_MESSAGE}${otherIndex + 1}`;
}

function clearFieldError(
    prev: AllDraftErrors,
    draftId: string,
    field: keyof PatientFormData,
): AllDraftErrors {
    const existing = prev[draftId];
    if (!existing?.[field]) return prev;
    const updated = { ...existing };
    delete updated[field];
    if (Object.keys(updated).length === 0) {
        const { [draftId]: _removed, ...rest } = prev;
        return rest;
    }
    return { ...prev, [draftId]: updated };
}

function parseBulkErrorsToDraftErrors(
    errors: Record<string, string | string[]>,
    filledDrafts: Draft[],
): AllDraftErrors {
    const parsed: AllDraftErrors = {};
    for (const [key, messages] of Object.entries(errors)) {
        if (key === "message") continue;
        const match = key.match(/^patients\.(\d+)\.(.+)$/);
        if (match) {
            const index = parseInt(match[1], 10);
            const field = match[2] as keyof PatientFormData;
            const draftId = filledDrafts[index]?.id;
            const msg = Array.isArray(messages) ? messages[0] : messages;
            if (draftId && msg) {
                parsed[draftId] ??= {};
                parsed[draftId][field] = msg;
            }
        }
    }
    return parsed;
}

export function useBulkAddPatients(onClose: () => void) {
    const initialDraftId = useRef(generateDraftId());
    const [drafts, setDrafts] = useState<BulkPatientFormData>([
        { id: initialDraftId.current, data: getDefaultFormData() },
    ]);
    const [activeDraftId, setActiveDraftId] = useState<string>(
        initialDraftId.current,
    );
    const { post, processing, transform, errors } = useForm<{
        patients: PatientFormData[];
    }>({ patients: [] });
    const [idNumberDuplicateError, setIdNumberDuplicateError] = useState<
        string | null
    >(null);
    const [draftErrors, setDraftErrors] = useState<AllDraftErrors>({});

    const formData = useMemo(() => {
        return (
            drafts.find((d) => d.id === activeDraftId)?.data ??
            getDefaultFormData()
        );
    }, [drafts, activeDraftId]);

    const setFormData = useCallback(
        (
            key: keyof PatientFormData,
            value: PatientFormData[keyof PatientFormData],
        ) => {
            setDrafts((prev) =>
                prev.map((d) =>
                    d.id === activeDraftId
                        ? { ...d, data: { ...d.data, [key]: value } }
                        : d,
                ),
            );
            setIdNumberDuplicateError(null);
            setDraftErrors((prev) => clearFieldError(prev, activeDraftId, key));
        },
        [activeDraftId],
    );

    const addAnother = () => {
        if (drafts.length >= MAX_DRAFTS) return;
        const newDraft = createDraft();
        setDrafts((prev) => [...prev, newDraft]);
        setActiveDraftId(newDraft.id);
        setIdNumberDuplicateError(null);
    };

    const selectDraft = useCallback(
        (id: string) => {
            if (id === activeDraftId) return;
            const targetDraft = drafts.find((d) => d.id === id);
            if (!targetDraft) return;
            setActiveDraftId(id);
            const error = findDuplicateIdError(
                drafts,
                id,
                targetDraft.data.id_number ?? "",
            );
            setIdNumberDuplicateError(error);
        },
        [drafts, activeDraftId],
    );

    const removeDraft = useCallback(
        (id: string) => {
            if (drafts.length === 1) return;
            setDraftErrors((prev) => {
                const { [id]: _removed, ...rest } = prev;
                return rest;
            });
            if (activeDraftId === id) {
                const currentIndex = drafts.findIndex((d) => d.id === id);
                const next =
                    drafts[currentIndex + 1] ?? drafts[currentIndex - 1];
                setActiveDraftId(next.id);
                setIdNumberDuplicateError(null);
            }
            setDrafts((prev) => prev.filter((d) => d.id !== id));
        },
        [drafts, activeDraftId],
    );

    const validateIdNumberOnBlur = useCallback(
        (idNumber: string) => {
            const error = findDuplicateIdError(drafts, activeDraftId, idNumber);
            setIdNumberDuplicateError(error);
        },
        [drafts, activeDraftId],
    );

    const saveAll = useCallback(
        (e: React.SubmitEvent<HTMLFormElement>) => {
            e.preventDefault();

            transform(() => ({
                patients: drafts.map((draft) => draft.data),
            }));

            post(route("patients.bulk.store"), {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => onClose(),
                onError: (errors: Record<string, string | string[]>) => {
                    const message = errors?.message;
                    const msgStr = Array.isArray(message)
                        ? message[0]
                        : message;
                    if (msgStr) {
                        toast.error(msgStr);
                    }
                    const parsed = parseBulkErrorsToDraftErrors(errors, drafts);
                    setDraftErrors(parsed);
                    const firstErrorDraftId = drafts.find(
                        (d) => parsed[d.id],
                    )?.id;
                    if (firstErrorDraftId) {
                        setActiveDraftId(firstErrorDraftId);
                        const targetDraft = drafts.find(
                            (d) => d.id === firstErrorDraftId,
                        );
                        if (targetDraft) {
                            setIdNumberDuplicateError(
                                findDuplicateIdError(
                                    drafts,
                                    firstErrorDraftId,
                                    targetDraft.data.id_number ?? "",
                                ),
                            );
                        }
                    }
                    if (Object.keys(parsed).length > 0) {
                        toast.error("יש לתקן שגיאות בטאבים המסומנים.");
                    }
                },
            });
        },
        [drafts, activeDraftId, onClose],
    );

    const hasUnsavedChanges = useMemo(
        () => drafts.some((d) => isFormFilled(d.data)),
        [drafts],
    );

    useEffect(() => {
        if (!hasUnsavedChanges) {
            return;
        }

        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            event.preventDefault();
            event.returnValue = "";
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [hasUnsavedChanges]);

    const draftIdsWithErrors = useMemo(
        () => new Set(Object.keys(draftErrors)),
        [draftErrors],
    );

    const activeErrors = useMemo(
        (): FieldErrors => ({
            ...draftErrors[activeDraftId],
            ...(idNumberDuplicateError
                ? { id_number: idNumberDuplicateError }
                : {}),
        }),
        [draftErrors, activeDraftId, idNumberDuplicateError],
    );

    return {
        drafts,
        activeDraftId,
        formData,
        setFormData,
        addAnother,
        selectDraft,
        removeDraft,
        saveAll,
        processing,
        canAddAnother: drafts.length < MAX_DRAFTS,
        validateIdNumberOnBlur,
        hasUnsavedChanges,
        draftIdsWithErrors,
        activeErrors,
    };
}
