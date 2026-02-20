import { toast } from "sonner";

/** Single place for all app toast messages. Only the frontend shows success/failure. */
export const toasts = {
    patient: {
        created: () => toast.success("המטופל נוצר בהצלחה"),
        updated: () => toast.success("המטופל עודכן בהצלחה"),
        deleted: () => toast.success("המטופל נמחק בהצלחה."),
        createFailed: () => toast.error("יצירת המטופל נכשלה"),
        updateFailed: () => toast.error("עדכון המטופל נכשל"),
        deleteFailed: () => toast.error("לא ניתן למחוק את המטופל."),
    },
};
