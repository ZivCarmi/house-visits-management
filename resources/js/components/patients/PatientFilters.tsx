import type { VisitFilter } from "@/hooks/usePatientFilters";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from "@/components/ui/select";

const LABEL = "ביקור מתוכנן";

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
    const selectedLabel =
        FILTER_OPTIONS.find((o) => o.value === filter)?.label ?? "בחר סינון";

    return (
        <Select
            value={filter}
            onValueChange={(value) => onChange(value as VisitFilter)}
        >
            <SelectTrigger size="sm" className="min-w-44">
                <span className="truncate">
                    {LABEL}: {selectedLabel}
                </span>
            </SelectTrigger>
            <SelectContent>
                {FILTER_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
