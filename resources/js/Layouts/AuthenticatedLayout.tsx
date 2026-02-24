import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { NavLink } from "@/components/ui/nav-link";
import { toast } from "sonner";
import { Link, useForm, usePage } from "@inertiajs/react";
import { AlertCircleIcon } from "lucide-react";
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
    const isUnverified = user && user.email_verified_at == null;
    const { post, processing } = useForm({});

    const resendVerification = () => {
        post(route("verification.send"));
    };

    return (
        <div className="min-h-svh">
            {isUnverified && (
                <div className="border-b bg-amber-600/10 px-6 py-3 dark:bg-amber-400/10 text-amber-600 dark:text-amber-400">
                    <div className="mx-auto flex max-w-screen-2xl items-center">
                        <p className="text-sm flex items-center gap-2">
                            <AlertCircleIcon className="size-4" />
                            האימייל שלך טרם אומת. חלק מהפעולות במערכת אינן
                            זמינות עד לאימות.
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
            )}
            <header className="border-b">
                <div className="mx-auto flex w-full max-w-screen-2xl items-center justify-between gap-4 px-6 py-4">
                    <nav className="flex items-center gap-6">
                        <NavLink href="/">הבית</NavLink>
                        <NavLink href="/patients">מטופלים</NavLink>
                    </nav>
                    <div className="flex items-center gap-6">
                        <ModeToggle />
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full"
                                >
                                    <Avatar>
                                        <AvatarImage
                                            src={user?.avatar ?? undefined}
                                            alt={user?.full_name}
                                        />
                                        <AvatarFallback>
                                            {user.first_name.charAt(0)}
                                            {user.last_name.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end">
                                <DropdownMenuLabel>
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm leading-none font-medium text-foreground">
                                            {user.full_name}
                                        </p>
                                        <p className="text-muted-foreground text-xs leading-none">
                                            {user.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem asChild>
                                        <Link href={route("profile.edit")}>
                                            פרופיל
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem
                                        asChild
                                        variant="destructive"
                                    >
                                        <Link
                                            href={route("logout")}
                                            method="post"
                                            className="w-full"
                                        >
                                            התנתקות
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-screen-2xl px-6 py-4">
                {children}
            </main>
        </div>
    );
}
