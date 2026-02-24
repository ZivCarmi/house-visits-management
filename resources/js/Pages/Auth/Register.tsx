import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
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

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const submit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route("register"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <GuestLayout>
            <Head title="הרשמה" />

            <Card className="w-full max-w-md">
                <form onSubmit={submit} className="space-y-4">
                    <CardHeader className="flex flex-row items-center justify-between gap-4">
                        <CardTitle>הרשמה</CardTitle>
                        <Link
                            href={route("login")}
                            className="text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
                        >
                            כבר רשום?
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <Button variant="outline" className="w-full" asChild>
                            <a href={route("auth.google")}>התחבר עם גוגל</a>
                        </Button>

                        <FieldSeparator className="my-4">
                            או הרשם עם אימייל
                        </FieldSeparator>

                        <FieldGroup>
                            <div className="grid grid-cols-2 gap-5">
                                <Field aria-invalid={!!errors.first_name}>
                                    <FieldLabel htmlFor="first_name">
                                        שם פרטי
                                    </FieldLabel>
                                    <Input
                                        autoFocus
                                        id="first_name"
                                        name="first_name"
                                        value={data.first_name}
                                        autoComplete="given-name"
                                        aria-invalid={!!errors.first_name}
                                        onChange={(e) =>
                                            setData(
                                                "first_name",
                                                e.target.value,
                                            )
                                        }
                                        required
                                    />
                                    <FieldError>{errors.first_name}</FieldError>
                                </Field>

                                <Field aria-invalid={!!errors.last_name}>
                                    <FieldLabel htmlFor="last_name">
                                        שם משפחה
                                    </FieldLabel>
                                    <Input
                                        id="last_name"
                                        name="last_name"
                                        value={data.last_name}
                                        autoComplete="family-name"
                                        aria-invalid={!!errors.last_name}
                                        onChange={(e) =>
                                            setData("last_name", e.target.value)
                                        }
                                        required
                                    />
                                    <FieldError>{errors.last_name}</FieldError>
                                </Field>
                            </div>

                            <Field aria-invalid={!!errors.email}>
                                <FieldLabel htmlFor="email">אימייל</FieldLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    autoComplete="username"
                                    aria-invalid={!!errors.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    // required
                                />
                                <FieldError>{errors.email}</FieldError>
                            </Field>

                            <Field>
                                <div className="grid grid-cols-2 gap-5">
                                    <Field aria-invalid={!!errors.password}>
                                        <FieldLabel htmlFor="password">
                                            סיסמה
                                        </FieldLabel>
                                        <Input
                                            id="password"
                                            type="password"
                                            name="password"
                                            value={data.password}
                                            autoComplete="new-password"
                                            aria-invalid={!!errors.password}
                                            onChange={(e) =>
                                                setData(
                                                    "password",
                                                    e.target.value,
                                                )
                                            }
                                            // required
                                        />
                                    </Field>

                                    <Field
                                        aria-invalid={
                                            !!errors.password_confirmation
                                        }
                                    >
                                        <FieldLabel htmlFor="password_confirmation">
                                            אימות סיסמה
                                        </FieldLabel>
                                        <Input
                                            id="password_confirmation"
                                            type="password"
                                            name="password_confirmation"
                                            value={data.password_confirmation}
                                            autoComplete="new-password"
                                            aria-invalid={
                                                !!errors.password_confirmation
                                            }
                                            onChange={(e) =>
                                                setData(
                                                    "password_confirmation",
                                                    e.target.value,
                                                )
                                            }
                                            // required
                                        />
                                    </Field>
                                </div>
                                <FieldError
                                    className=""
                                    errors={
                                        errors.password &&
                                        Array.isArray(errors.password)
                                            ? errors.password.map(
                                                  (error: string) => ({
                                                      message: error,
                                                  }),
                                              )
                                            : [{ message: errors.password }]
                                    }
                                />
                            </Field>
                        </FieldGroup>
                    </CardContent>
                    <CardFooter>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="w-full"
                        >
                            הרשמה
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </GuestLayout>
    );
}
