import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
import { Head } from "@inertiajs/react";
import DeleteUserForm from "./Partials/DeleteUserForm";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";

export default function Edit({
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    return (
        <AuthenticatedLayout>
            <Head title="פרופיל" />

            <div className="py-12">
                <div className="flex flex-col gap-6">
                    <div className="rounded-xl border p-6">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-md"
                        />
                    </div>

                    <div className="rounded-xl border p-6">
                        <UpdatePasswordForm className="max-w-md" />
                    </div>

                    <div className="rounded-xl border p-6">
                        <DeleteUserForm className="max-w-md" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
