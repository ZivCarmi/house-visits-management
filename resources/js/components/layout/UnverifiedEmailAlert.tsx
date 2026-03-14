import { useForm, usePage } from "@inertiajs/react";
import { AlertCircleIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export function UnverifiedEmailAlert() {
    const { props } = usePage();
    const user = props.auth?.user;

    if (!user || user.email_verified_at != null) {
        return null;
    }

    const { post, processing } = useForm({});

    const resendVerification = () => {
        post(route("verification.send"));
    };

    return (
        <div className="border-b bg-amber-600/10 px-6 py-3 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400">
            <div className="mx-auto flex max-w-screen-2xl items-center">
                <p className="flex items-center gap-2 text-sm">
                    <AlertCircleIcon className="size-4" />
                    האימייל שלך טרם אומת. חלק מהפעולות במערכת אינן זמינות עד
                    לאימות.
                </p>
                <Button
                    type="button"
                    variant="link"
                    size="sm"
                    onClick={resendVerification}
                    disabled={processing}
                >
                    שלח שוב מייל אימות
                </Button>
            </div>
        </div>
    );
}
