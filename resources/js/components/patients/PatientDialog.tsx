import { useState } from "react";
import type { Patient } from "@/types/patient";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useBulkAddPatients, isFormFilled } from "@/hooks/useBulkAddPatients";
import { Spinner } from "@/components/ui/spinner";
import { PatientFormFields } from "./PatientForm";
import { EditPatientDialog } from "@/components/patients/EditPatientDialog";
import { PatientDraftTabs } from "@/components/patients/PatientDraftTabs";

const CLOSE_CONFIRM_TITLE = "יש שינויים שלא נשמרו. האם לסגור?";
const REMOVE_DRAFT_TITLE = "למחוק את המטופל מהרשימה? השינויים יאבדו.";

interface PatientDialogProps {
    open: boolean;
    patient?: Patient;
    onClose: () => void;
}

export function PatientDialog({ open, patient, onClose }: PatientDialogProps) {
    const [showCloseConfirm, setShowCloseConfirm] = useState(false);
    const [removeDraftId, setRemoveDraftId] = useState<string | null>(null);

    const {
        drafts,
        activeDraftId,
        formData,
        setFormData,
        addAnother,
        selectDraft,
        removeDraft,
        saveAll,
        hasUnsavedChanges,
        processing,
        canAddAnother,
        validateIdNumberOnBlur,
        draftIdsWithErrors,
        activeErrors,
    } = useBulkAddPatients(onClose);

    const isCreateMode = !patient;

    const handleRequestClose = () => {
        if (isCreateMode && hasUnsavedChanges) {
            setShowCloseConfirm(true);
        } else {
            onClose();
        }
    };

    const handleRemoveDraftRequest = (draftId: string) => {
        setRemoveDraftId(draftId);
    };

    const handleRemoveDraftConfirm = () => {
        if (!removeDraftId) return;
        removeDraft(removeDraftId);
        setRemoveDraftId(null);
    };

    const handleOpenChange = (nextOpen: boolean) => {
        if (!nextOpen) {
            handleRequestClose();
        }
    };

    if (patient) {
        return (
            <EditPatientDialog open={open} patient={patient} onClose={onClose} />
        );
    }

    return (
        <>
            <Dialog open={open} onOpenChange={handleOpenChange}>
                <DialogContent className="sm:max-w-xl">
                    <form onSubmit={saveAll} className="space-y-4">
                        <DialogHeader>
                            <DialogTitle>יצירת מטופל חדש</DialogTitle>
                        </DialogHeader>

                        <PatientDraftTabs
                            drafts={drafts}
                            activeDraftId={activeDraftId}
                            draftIdsWithErrors={draftIdsWithErrors}
                            canAddAnother={canAddAnother}
                            onSelectDraft={selectDraft}
                            onAddAnother={addAnother}
                            onRemoveDraftClick={(draft) => {
                                if (!isFormFilled(draft.data)) {
                                    removeDraft(draft.id);
                                    return;
                                }
                                handleRemoveDraftRequest(draft.id);
                            }}
                        />

                        <PatientFormFields
                            data={formData}
                            setData={setFormData}
                            errors={activeErrors}
                            onIdNumberBlur={validateIdNumberOnBlur}
                        />

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleRequestClose}
                            >
                                סגור
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing && (
                                    <Spinner data-icon="inline-start" />
                                )}
                                {drafts.length > 1 ? "שמירת מטופלים" : "שמירת מטופל"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <AlertDialog
                open={showCloseConfirm}
                onOpenChange={setShowCloseConfirm}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {CLOSE_CONFIRM_TITLE}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            השינויים לא יישמרו.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>ביטול</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                setShowCloseConfirm(false);
                                onClose();
                            }}
                        >
                            סגור
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog
                open={removeDraftId !== null}
                onOpenChange={(open) => !open && setRemoveDraftId(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {REMOVE_DRAFT_TITLE}
                        </AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>ביטול</AlertDialogCancel>
                        <AlertDialogAction
                            variant="destructive"
                            onClick={handleRemoveDraftConfirm}
                        >
                            מחיקה
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
