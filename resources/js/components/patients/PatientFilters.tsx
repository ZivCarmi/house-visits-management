import type { VisitFilter } from "@/hooks/usePatientFilters";
import { Button } from "../ui/button";

interface PatientFiltersProps {
    filter: VisitFilter;
    onChange: (filter: VisitFilter) => void;
}

const FILTER_OPTIONS: { value: VisitFilter; label: string }[] = [
    { value: "all", label: "הכל" },
    { value: "weekly", label: "השבוע" },
    { value: "monthly", label: "החודש" },
    { value: "overdue", label: "באיחור" },
];

export function PatientFilters({ filter, onChange }: PatientFiltersProps) {
    return (
        <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm text-muted-foreground">
                סינון לפי ביקור הבא:
            </span>
            <div className="inline-flex gap-2">
                {FILTER_OPTIONS.map((option) => {
                    const isActive = option.value === filter;

                    return (
                        <Button
                            key={option.value}
                            variant={isActive ? "default" : "outline"}
                            size="sm"
                            onClick={() => onChange(option.value)}
                        >
                            {option.label}
                        </Button>
                    );
                })}
            </div>
        </div>
    );
}
