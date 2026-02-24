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
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });

    const submit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        post(route("password.email"));
    };

    return (
        <GuestLayout>
            <Head title="איפוס סיסמה" />

            <Card className="w-full max-w-md">
                {status && (
                    <div className="mb-4 text-sm font-medium text-green-600">
                        {status}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-4">
                    <CardHeader className="flex flex-row items-center justify-between gap-4">
                        <CardTitle>איפוס סיסמה</CardTitle>
                        <Link
                            href={route("login")}
                            className="text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
                        >
                            חזרה להתחברות
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-4 text-sm text-muted-foreground">
                            לצורך איפוס הסיסמה, יש להזין את כתובת האימייל
                            המשויכת לחשבון.
                        </p>

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
                                />
                                <FieldError>{errors.email}</FieldError>
                            </Field>
                        </FieldGroup>
                    </CardContent>
                    <CardFooter>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="w-full"
                        >
                            שלח קישור לאיפוס סיסמה
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </GuestLayout>
    );
}
