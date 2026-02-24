import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Link, useForm, usePage } from "@inertiajs/react";
import { AlertCircleIcon, BadgeCheck, BadgeX } from "lucide-react";

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = "",
}: {
    mustVerifyEmail: boolean;
    status?: string;
    className?: string;
}) {
    const user = usePage().props.auth.user;
    const isEmailVerified = user.email_verified_at != null;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
        });

    const submit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        patch(route("profile.update"));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium">פרופיל</h2>

                <p className="mt-1 text-sm">
                    עדכן את פרופיל החשבון שלך ואימייל.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div className="grid grid-cols-2 gap-5">
                    <Field>
                        <FieldLabel htmlFor="first_name">שם פרטי</FieldLabel>

                        <Input
                            id="first_name"
                            className="mt-1 block w-full"
                            value={data.first_name}
                            onChange={(e) =>
                                setData("first_name", e.target.value)
                            }
                            required
                            autoComplete="given-name"
                        />

                        {errors.first_name && (
                            <FieldError>{errors.first_name}</FieldError>
                        )}
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="last_name">שם משפחה</FieldLabel>

                        <Input
                            id="last_name"
                            className="mt-1 block w-full"
                            value={data.last_name}
                            onChange={(e) =>
                                setData("last_name", e.target.value)
                            }
                            required
                            autoComplete="family-name"
                        />

                        {errors.last_name && (
                            <FieldError>{errors.last_name}</FieldError>
                        )}
                    </Field>
                </div>

                <Field>
                    <div className="flex items-center gap-2 justify-between">
                        <FieldLabel htmlFor="email">אימייל</FieldLabel>
                        {isEmailVerified ? (
                            <Badge
                                className={cn(
                                    "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
                                )}
                                variant="secondary"
                            >
                                <BadgeCheck data-icon="inline-start" />
                                מאומת
                            </Badge>
                        ) : (
                            <Badge className="bg-amber-600/10 text-amber-600 focus-visible:ring-amber-600/20 focus-visible:outline-none dark:bg-amber-400/10 dark:text-amber-400 dark:focus-visible:ring-amber-400/40 [a&]:hover:bg-amber-600/5 dark:[a&]:hover:bg-amber-400/5">
                                <AlertCircleIcon className="size-3" />
                                לא מאומת
                            </Badge>
                        )}
                    </div>
                    <Input
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        required
                        autoComplete="username"
                    />

                    {errors.email && <FieldError>{errors.email}</FieldError>}
                </Field>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm">
                            כתובת האימייל שלך עדיין לא אומתה.
                            <Button variant="link" asChild>
                                <Link
                                    href={route("verification.send")}
                                    method="post"
                                    as="button"
                                    className=""
                                >
                                    שלח שוב מייל אימות
                                </Link>
                            </Button>
                        </p>

                        {status === "verification-link-sent" && (
                            <div className="mt-2 text-sm font-medium text-green-600">
                                קישור אימות חדש נשלח לכתובת האימייל שלך.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <Button disabled={processing}>שמירה</Button>

                    {recentlySuccessful && (
                        <p className="text-sm text-green-600 animate-in fade-in-0 duration-200">
                            נשמר.
                        </p>
                    )}
                </div>
            </form>
        </section>
    );
}
