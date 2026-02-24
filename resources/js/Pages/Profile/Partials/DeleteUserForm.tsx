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
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useForm } from "@inertiajs/react";
import { FormEventHandler, useRef, useState } from "react";

export default function DeleteUserForm({
    className = "",
}: {
    className?: string;
}) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: "",
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        destroy(route("profile.destroy"), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header>
                <h2 className="text-lg font-medium">מחיקת חשבון</h2>

                <p className="mt-1 text-sm">
                    לאחר מחיקת החשבון, כל המשאבים והנתונים ימחקו לצמיתות! <br />{" "}
                    לפני מחיקת החשבון, אנא הורידו את כל הנתונים או המידע
                    שברצונכם לשמור.
                </p>
            </header>

            <Button
                variant="destructive"
                onClick={confirmUserDeletion}
                className="w-full"
            >
                מחיקת חשבון
            </Button>

            <AlertDialog
                open={confirmingUserDeletion}
                onOpenChange={(open) => !open && closeModal()}
            >
                <AlertDialogContent>
                    <form onSubmit={deleteUser} className="space-y-4">
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                האם אתה בטוח שברצונך למחוק את החשבון?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                לאחר מחיקת החשבון, כל המשאבים והנתונים ימחקו
                                לצמיתות! <br /> אנא הזן את סיסמת החשבון כדי
                                לאשר.
                            </AlertDialogDescription>
                        </AlertDialogHeader>

                        <Field>
                            <FieldLabel htmlFor="password">סיסמה</FieldLabel>
                            <Input
                                id="password"
                                type="password"
                                name="password"
                                ref={passwordInput}
                                value={data.password}
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                className="mt-1 block w-full"
                                placeholder="סיסמה"
                            />
                            {errors.password && (
                                <FieldError>{errors.password}</FieldError>
                            )}
                        </Field>

                        <AlertDialogFooter>
                            <AlertDialogCancel type="button">
                                ביטול
                            </AlertDialogCancel>
                            <AlertDialogAction
                                type="submit"
                                variant="destructive"
                                disabled={processing}
                                className="ms-3"
                            >
                                מחיקת חשבון
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </form>
                </AlertDialogContent>
            </AlertDialog>
        </section>
    );
}
