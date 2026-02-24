import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, useForm } from "@inertiajs/react";

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
            <Head title="Forgot Password" />

            <div className="mb-4 text-sm text-muted-foreground">
                Forgot your password? No problem. Just let us know your email
                address and we will email you a password reset link.
            </div>

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="flex flex-col gap-4">
                <Field aria-invalid={!!errors.email}>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                        autoFocus
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

                <div className="flex items-center justify-end">
                    <Button type="submit" disabled={processing}>
                        Email Password Reset Link
                    </Button>
                </div>
            </form>
        </GuestLayout>
    );
}
