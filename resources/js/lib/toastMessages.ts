import { toast } from "sonner";
import type { FailedPatient } from "@/types/patient";

/** Single place for all app toast messages. Only the frontend shows success/failure. */
export const toasts = {
    patient: {
        created: () => toast.success("המטופל נוצר בהצלחה"),
        updated: () => toast.success("המטופל עודכן בהצלחה"),
        deleted: () => toast.success("המטופל נמחק בהצלחה."),
        createFailed: () => toast.error("יצירת המטופל נכשלה"),
        updateFailed: () => toast.error("עדכון המטופל נכשל"),
        deleteFailed: () => toast.error("לא ניתן למחוק את המטופל."),
        copiedId: () => toast.success("תעודת הזהות הועתקה"),
        locationsPartiallyFailed: (failed: FailedPatient[]) => {
            const names = failed.map((f) => f.full_name).join(", ");
            const message =
                failed.length === 1
                    ? `לא ניתן היה להציג מיקום עבור: ${names}. יש לוודא כתובת תקנית.`
                    : `לא ניתן היה להציג מיקום עבור ${failed.length} מטופלים: ${names}. יש לוודא כתובות תקניות.`;
            toast.warning(message, {
                duration: Infinity,
                action: {
                    label: "הבנתי",
                    onClick: () => toast.dismiss(),
                },
            });
        },
    },
};
