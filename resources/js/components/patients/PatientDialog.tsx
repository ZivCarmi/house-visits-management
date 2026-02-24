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
import { Spinner } from "../ui/spinner";

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
            <DialogContent className="sm:max-w-lg">
                <form onSubmit={submit} className="space-y-4">
                    <DialogHeader>
                        <DialogTitle>
                            {patient ? "עריכת פרטי מטופל" : "יצירת מטופל חדש"}
                        </DialogTitle>
                    </DialogHeader>
                    <PatientFormFields
                        data={data}
                        setData={setData}
                        errors={errors}
                    />
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">סגור</Button>
                        </DialogClose>
                        <Button disabled={processing}>
                            {processing && <Spinner data-icon="inline-start" />}
                            שמירת מטופל
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
