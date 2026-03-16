import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
    FEEDBACK_TYPE_DESCRIPTIONS,
    FEEDBACK_TYPE_OPTIONS,
} from "@/lib/feedbackLabels";

export type FeedbackFormData = {
    type: string;
    message: string;
};

export interface FeedbackFormFieldsProps {
    data: FeedbackFormData;
    setData: <K extends keyof FeedbackFormData>(
        key: K,
        value: FeedbackFormData[K],
    ) => void;
    errors: Partial<Record<keyof FeedbackFormData, string>>;
}

export function FeedbackFormFields({
    data,
    setData,
    errors,
}: FeedbackFormFieldsProps) {
    const description = data.type
        ? FEEDBACK_TYPE_DESCRIPTIONS[data.type]
        : null;

    return (
        <FieldGroup>
            <Field aria-invalid={!!errors.type}>
                <FieldLabel htmlFor="feedback-type">
                    סוג
                    <span className="text-destructive">*</span>
                </FieldLabel>
                <Select
                    value={data.type}
                    onValueChange={(value) => setData("type", value)}
                    aria-invalid={!!errors.type}
                    aria-required
                    required
                >
                    <SelectTrigger id="feedback-type" className="w-full">
                        <SelectValue placeholder="בחר סוג משוב" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {FEEDBACK_TYPE_OPTIONS.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                {errors.type && <FieldError>{errors.type}</FieldError>}
            </Field>
            <Field aria-invalid={!!errors.message}>
                <FieldLabel htmlFor="feedback-message">
                    {description ? description : "הרחב כאן..."}
                    <span className="text-destructive">*</span>
                </FieldLabel>
                <Textarea
                    id="feedback-message"
                    rows={4}
                    value={data.message}
                    onChange={(e) => setData("message", e.target.value)}
                    aria-invalid={!!errors.message}
                    aria-required
                    required
                    minLength={10}
                    placeholder="הרחב כאן..."
                />
                {errors.message && (
                    <FieldError>{errors.message}</FieldError>
                )}
            </Field>
        </FieldGroup>
    );
}
