import { GoogleSignInButton } from "@/components/GoogleSignInButton";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Login({
    canResetPassword,
    status,
}: {
    canResetPassword: boolean;
    status?: string;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false as boolean,
    });

    const submit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <GuestLayout>
            <Head title="התחברות" />

            <Card className="w-full max-w-md">
                {status && (
                    <div className="mb-4 text-sm font-medium text-green-600">
                        {status}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-4">
                    <CardHeader className="flex flex-row items-center justify-between gap-4">
                        <CardTitle>התחברות</CardTitle>
                        <Link
                            href={route("register")}
                            className="text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
                        >
                            הרשמה
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <GoogleSignInButton />

                        <FieldSeparator className="my-4">
                            או המשך עם אימייל
                        </FieldSeparator>

                        <FieldGroup>
                            <Field aria-invalid={!!errors.email}>
                                <FieldLabel htmlFor="email">אימייל</FieldLabel>
                                <Input
                                    autoFocus
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-1 block w-full"
                                    autoComplete="username"
                                    aria-invalid={!!errors.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    required
                                />
                                <FieldError>{errors.email}</FieldError>
                            </Field>

                            <Field aria-invalid={!!errors.password}>
                                <div className="flex w-full items-center justify-between gap-2">
                                    <FieldLabel htmlFor="password">
                                        סיסמה
                                    </FieldLabel>
                                    {canResetPassword && (
                                        <Link
                                            href={route("password.request")}
                                            className="text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
                                        >
                                            שכחת סיסמה?
                                        </Link>
                                    )}
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="mt-1 block w-full"
                                    autoComplete="current-password"
                                    aria-invalid={!!errors.password}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                    required
                                />
                                <FieldError>{errors.password}</FieldError>
                            </Field>

                            <Field orientation="horizontal">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    checked={data.remember}
                                    onCheckedChange={(checked) =>
                                        setData("remember", checked === true)
                                    }
                                />
                                <FieldLabel
                                    htmlFor="remember"
                                    className="cursor-pointer font-normal text-muted-foreground"
                                >
                                    זכור אותי
                                </FieldLabel>
                            </Field>
                        </FieldGroup>
                    </CardContent>
                    <CardFooter>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="w-full"
                        >
                            התחבר
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </GuestLayout>
    );
}
