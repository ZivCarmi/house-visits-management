import type { FollowUpFrequency } from "@/types/patient";

/** Single source of Hebrew labels for follow-up frequency (form + table). */
export const FOLLOWUP_FREQUENCY_LABELS: Record<FollowUpFrequency, string> = {
    weekly: "שבועי",
    biweekly: "דו־שבועי",
    monthly: "חודשי",
    bimonthly: "דו־חודשי",
    quarterly: "רבעוני",
    semiannual: "חצי שנתי",
};

export const FOLLOWUP_FREQUENCY_OPTIONS: {
    label: string;
    value: FollowUpFrequency;
}[] = (
    Object.entries(FOLLOWUP_FREQUENCY_LABELS) as [FollowUpFrequency, string][]
).map(([value, label]) => ({ label, value }));
