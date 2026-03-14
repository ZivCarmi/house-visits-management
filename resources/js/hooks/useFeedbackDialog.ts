import { useEffect, useMemo, useState } from "react";
import { useForm } from "@inertiajs/react";

import type { FeedbackFormData } from "@/components/feedback/FeedbackForm";

export function useFeedbackDialog() {
    const { data, setData, post, processing, errors, reset } =
        useForm<FeedbackFormData>({
            type: "feature_idea",
            message: "",
        });
    const [open, setOpen] = useState(false);
    const [showCloseConfirm, setShowCloseConfirm] = useState(false);

    const hasUnsavedChanges = useMemo(
        () =>
            data.type !== "feature_idea" ||
            (data.message?.trim()?.length ?? 0) > 0,
        [data],
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

    const closeDialog = () => {
        reset();
        setOpen(false);
    };

    const handleRequestClose = () => {
        if (hasUnsavedChanges) {
            setShowCloseConfirm(true);
        } else {
            closeDialog();
        }
    };

    const handleOpenChange = (nextOpen: boolean) => {
        if (nextOpen) {
            setOpen(true);
        } else {
            handleRequestClose();
        }
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        post(route("feedback.store"), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setOpen(false);
            },
        });
    };

    const handleConfirmClose = () => {
        setShowCloseConfirm(false);
        closeDialog();
    };

    return {
        open,
        data,
        setData,
        errors: errors as Partial<Record<keyof FeedbackFormData, string>>,
        processing,
        hasUnsavedChanges,
        showCloseConfirm,
        setShowCloseConfirm,
        handleRequestClose,
        handleOpenChange,
        handleSubmit,
        handleConfirmClose,
    };
}
