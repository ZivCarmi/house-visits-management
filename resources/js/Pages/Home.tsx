import { Card, CardContent } from "@/components/ui/card";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import type { LucideIcon } from "lucide-react";
import { CalendarClockIcon, CheckCircleIcon, UsersIcon } from "lucide-react";

type HomeStats = {
    total_patients: number;
    need_visit_this_week: number;
    visited_this_month: number;
};

type HomeProps = {
    stats: HomeStats;
};

const STAT_CARDS: {
    key: keyof HomeStats;
    label: string;
    icon: LucideIcon;
    color: string;
}[] = [
    {
        key: "total_patients",
        label: "סה״כ מטופלים",
        icon: UsersIcon,
        color: "text-primary",
    },
    {
        key: "need_visit_this_week",
        label: "מתוכננים השבוע",
        icon: CalendarClockIcon,
        color: "text-blue-500",
    },
    {
        key: "visited_this_month",
        label: "בוקרו החודש",
        icon: CheckCircleIcon,
        color: "text-green-500",
    },
];

export default function Home({ stats }: HomeProps) {
    return (
        <AuthenticatedLayout>
            <Head title="דף הבית" />
            <h2 className="text-2xl font-semibold tracking-tight mb-6">
                ברוך הבא!
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
                {STAT_CARDS.map(({ key, label, icon: Icon, color }) => (
                    <Card key={key} className="p-4">
                        <CardContent className="flex items-center gap-4 p-0">
                            <div
                                className={`flex size-16 shrink-0 items-center justify-center rounded-full border border-current/10`}
                            >
                                <Icon className={`size-7 ${color}`} />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="mt-0.5 text-sm text-muted-foreground">
                                    {label}
                                </p>
                                <p className="text-2xl font-bold tabular-nums text-foreground">
                                    {stats[key]}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </AuthenticatedLayout>
    );
}
