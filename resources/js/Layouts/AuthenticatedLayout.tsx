import { ModeToggle } from "@/components/ui/mode-toggle";
import { NavLink } from "@/components/ui/nav-link";
import { FeedbackDialog } from "@/components/feedback/FeedbackDialog";
import { UserMenu } from "@/components/layout/UserMenu";
import { UnverifiedEmailAlert } from "@/components/layout/UnverifiedEmailAlert";
import { toast } from "sonner";
import { usePage } from "@inertiajs/react";
import { PropsWithChildren, useEffect } from "react";

export default function AuthenticatedLayout({ children }: PropsWithChildren) {
    const { props } = usePage();
    const user = props.auth?.user;
    const flash = props.flash;

    useEffect(() => {
        if (flash?.error) {
            toast.error(flash.error);
        }
        if (flash?.status) {
            toast.success(flash.status);
        }
    }, [flash?.error, flash?.status]);

    return (
        <div className="min-h-svh">
            <UnverifiedEmailAlert />
            <header className="border-b">
                <div className="mx-auto flex w-full max-w-screen-2xl items-center justify-between gap-4 px-6 py-4">
                    <nav className="flex items-center gap-6">
                        <NavLink href="/">הבית</NavLink>
                        <NavLink href="/patients">מטופלים</NavLink>
                    </nav>
                    <div className="flex items-center gap-6">
                        <FeedbackDialog />
                        <ModeToggle />
                        <UserMenu user={user} />
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-screen-2xl px-6 py-4">
                {children}
            </main>
        </div>
    );
}
