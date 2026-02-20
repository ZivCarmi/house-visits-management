import type { Patient } from "@/types/patient";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { usePatientForm } from "@/hooks/usePatientForm";
import { PatientFormFields } from "./PatientForm";

interface PatientDialogProps {
    open: boolean;
    patient?: Patient;
    onClose: () => void;
}

export function PatientDialog({ open, patient, onClose }: PatientDialogProps) {
    const { data, setData, errors, processing, submit } = usePatientForm(
        patient,
        onClose,
    );

    return (
        <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-xl">
                <form onSubmit={submit} className="space-y-4">
                    <DialogHeader>
                        <DialogTitle>
                            {patient ? "עריכת מטופל" : "מטופל חדש"}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        <PatientFormFields
                            data={data}
                            setData={setData}
                            errors={errors}
                        />
                    </div>
                    <DialogFooter showCloseButton>
                        <Button type="submit" disabled={processing}>
                            שמירת מטופל
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
