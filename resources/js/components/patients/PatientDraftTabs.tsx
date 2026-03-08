import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Draft } from "@/hooks/useBulkAddPatients";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface PatientDraftTabsProps {
    drafts: Draft[];
    activeDraftId: string;
    draftIdsWithErrors: Set<string>;
    canAddAnother: boolean;
    onSelectDraft: (draftId: string) => void;
    onAddAnother: () => void;
    onRemoveDraftClick: (draft: Draft) => void;
}

const ADD_ANOTHER_PATIENT_MESSAGE = "מטופל נוסף";

export function PatientDraftTabs({
    drafts,
    activeDraftId,
    draftIdsWithErrors,
    canAddAnother,
    onSelectDraft,
    onAddAnother,
    onRemoveDraftClick,
}: PatientDraftTabsProps) {
    return (
        <div className="-mx-4 flex items-end border-b px-4 pb-0" role="tablist">
            <div className="flex min-w-0 flex-1 items-end gap-1">
                {drafts.map((draft, index) => {
                    const isActive = activeDraftId === draft.id;
                    const hasError = draftIdsWithErrors.has(draft.id);

                    return (
                        <div
                            key={draft.id}
                            className={cn(
                                "relative flex min-w-0 flex-1 max-w-36 rounded-t-md border border-b-0 text-sm focus-within:bg-accent",
                                isActive &&
                                !hasError &&
                                "bg-background border-border -mb-px focus-within:bg-background",
                                isActive &&
                                hasError &&
                                "bg-background border-destructive/60 -mb-px focus-within:bg-background",
                                !isActive &&
                                !hasError &&
                                "bg-muted/50 hover:bg-muted/80 border-transparent",
                                !isActive &&
                                hasError &&
                                "bg-destructive/10 border-destructive/40 hover:bg-destructive/15",
                                hasError && "text-destructive",
                            )}
                        >
                            <button
                                type="button"
                                role="tab"
                                aria-selected={isActive}
                                className="min-w-0 flex-1 px-2 py-1.5 pe-7 truncate rounded text-start focus:outline-none"
                                onClick={() => onSelectDraft(draft.id)}
                            >
                                {draft.data.full_name?.trim() ||
                                    `מטופל ${index + 1}`}
                            </button>

                            {drafts.length > 1 && (
                                <button
                                    type="button"
                                    aria-label="הסר מטופל מהרשימה"
                                    className="absolute left-1 top-1/2 -translate-y-1/2 shrink-0 rounded p-0.5 hover:bg-muted-foreground/20 focus:outline-none focus:ring-2 focus:ring-ring"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onRemoveDraftClick(draft);
                                    }}
                                >
                                    <X className="size-3.5" />
                                </button>
                            )}
                        </div>
                    );
                })}

                {canAddAnother && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                type="button"
                                aria-label={ADD_ANOTHER_PATIENT_MESSAGE}
                                className="mb-px ml-1 shrink-0 rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                onClick={onAddAnother}
                            >
                                <Plus className="size-4" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>{ADD_ANOTHER_PATIENT_MESSAGE}</TooltipContent>
                    </Tooltip>

                )}
            </div>
        </div>
    );
}
