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
    DialogTrigger,
} from "@/components/ui/dialog";
import { FeedbackFormFields } from "@/components/feedback/FeedbackForm";
import { useFeedbackDialog } from "@/hooks/useFeedbackDialog";
import { Spinner } from "../ui/spinner";
import { MessageSquareIcon } from "lucide-react";

const CLOSE_CONFIRM_TITLE = "יש שינויים שלא נשמרו. האם לסגור?";

export function FeedbackDialog() {
    const {
        open,
        data,
        setData,
        errors,
        processing,
        showCloseConfirm,
        setShowCloseConfirm,
        handleRequestClose,
        handleOpenChange,
        handleSubmit,
        handleConfirmClose,
    } = useFeedbackDialog();

    return (
        <>
            <Dialog open={open} onOpenChange={handleOpenChange}>
                <DialogTrigger asChild>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="gap-2"
                    >
                        <MessageSquareIcon className="size-4" />
                        משוב
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <DialogHeader>
                            <DialogTitle>שלח משוב</DialogTitle>
                        </DialogHeader>

                        <FeedbackFormFields
                            data={data}
                            setData={setData}
                            errors={errors}
                        />

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleRequestClose}
                            >
                                ביטול
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing && (
                                    <Spinner data-icon="inline-start" />
                                )}
                                שלח משוב
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
                        <AlertDialogAction onClick={handleConfirmClose}>
                            סגור
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
