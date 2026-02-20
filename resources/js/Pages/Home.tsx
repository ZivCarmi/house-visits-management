import { Head } from "@inertiajs/react";
import { AppLayout } from "@/Layouts/AppLayout";

export default function Home() {
    return (
        <AppLayout>
            <Head title="דף הבית" />
            <p className="text-lg font-medium">ברוך הבא.</p>
        </AppLayout>
    );
}
