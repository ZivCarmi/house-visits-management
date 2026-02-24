import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, useForm } from "@inertiajs/react";

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: "",
    });

    const submit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        post(route("password.confirm"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <GuestLayout>
            <Head title="Confirm Password" />

            <div className="mb-4 text-sm text-gray-600">
                This is a secure area of the application. Please confirm your
                password before continuing.
            </div>

            <form onSubmit={submit}>
                <Field className="mt-4">
                    <FieldLabel htmlFor="password">Password</FieldLabel>

                    <Input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        onChange={(e) => setData("password", e.target.value)}
                    />

                    {errors.password && (
                        <FieldError>{errors.password}</FieldError>
                    )}
                </Field>

                <div className="mt-4 flex items-center justify-end">
                    <Button
                        className="ms-4"
                        disabled={processing}
                        type="submit"
                    >
                        Confirm
                    </Button>
                </div>
            </form>
        </GuestLayout>
    );
}
