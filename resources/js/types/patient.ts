export type FeedingType = "PO" | "PEG" | "PEJ" | "PZ" | "TPN";

export type FollowUpFrequency =
    | "weekly"
    | "biweekly"
    | "monthly"
    | "bimonthly"
    | "quarterly"
    | "semiannual"
    | "none";

export interface Patient {
    id: number;
    full_name: string;
    id_number: string;
    address: string;
    phone: string;
    feeding_type: FeedingType;
    last_visit_date: string;
    followup_frequency: FollowUpFrequency;
    next_visit_date: string | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
}

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface PaginatedPatients {
    data: Patient[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}
