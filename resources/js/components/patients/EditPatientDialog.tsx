import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { usePatientForm } from "@/hooks/usePatientForm";
import type { Patient } from "@/types/patient";
import { PatientFormFields } from "./PatientForm";

interface EditPatientDialogProps {
    open: boolean;
    patient: Patient;
    onClose: () => void;
}

export function EditPatientDialog({
    open,
    patient,
    onClose,
}: EditPatientDialogProps) {
    const { data, setData, errors, processing, submit } = usePatientForm(
        patient,
        onClose,
    );

    return (
        <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
            <DialogContent className="sm:max-w-lg">
                <form onSubmit={submit} className="space-y-4">
                    <DialogHeader>
                        <DialogTitle>עריכת פרטי מטופל</DialogTitle>
                    </DialogHeader>
                    <PatientFormFields
                        data={data}
                        setData={setData}
                        errors={errors}
                    />
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            סגור
                        </Button>
                        <Button disabled={processing} type="submit">
                            {processing && <Spinner data-icon="inline-start" />}
                            שמירת מטופל
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
