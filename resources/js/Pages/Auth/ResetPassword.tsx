import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, useForm } from "@inertiajs/react";

export default function ResetPassword({
    token,
    email,
}: {
    token: string;
    email: string;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token,
        email,
        password: "",
        password_confirmation: "",
    });

    const submit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        post(route("password.store"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <GuestLayout>
            <Head title="Reset Password" />

            <form onSubmit={submit} className="flex flex-col gap-4">
                <Field aria-invalid={!!errors.email}>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        aria-invalid={!!errors.email}
                        onChange={(e) => setData("email", e.target.value)}
                    />
                    <FieldError>{errors.email}</FieldError>
                </Field>

                <Field aria-invalid={!!errors.password}>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                        autoFocus
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        aria-invalid={!!errors.password}
                        onChange={(e) => setData("password", e.target.value)}
                    />
                    <FieldError>{errors.password}</FieldError>
                </Field>

                <Field aria-invalid={!!errors.password_confirmation}>
                    <FieldLabel htmlFor="password_confirmation">
                        Confirm Password
                    </FieldLabel>
                    <Input
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        aria-invalid={!!errors.password_confirmation}
                        onChange={(e) =>
                            setData("password_confirmation", e.target.value)
                        }
                    />
                    <FieldError>{errors.password_confirmation}</FieldError>
                </Field>

                <div className="flex items-center justify-end">
                    <Button type="submit" disabled={processing}>
                        Reset Password
                    </Button>
                </div>
            </form>
        </GuestLayout>
    );
}
