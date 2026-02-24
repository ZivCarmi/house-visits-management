import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { PatientFormData } from "@/hooks/usePatientForm";
import { FOLLOWUP_FREQUENCY_OPTIONS } from "@/lib/patientLabels";
import { digitsOnly } from "@/lib/utils";
import type { FeedingType, FollowUpFrequency } from "@/types/patient";
import { format } from "date-fns";
import { he } from "date-fns/locale";

const feedingTypes: FeedingType[] = ["PO", "PEG", "PEJ", "PZ", "TPN"];

export interface PatientFormFieldsProps {
    data: PatientFormData;
    setData: (
        key: keyof PatientFormData,
        value: PatientFormData[keyof PatientFormData],
    ) => void;
    errors: Partial<Record<keyof PatientFormData, string>>;
}

export function PatientFormFields({
    data,
    setData,
    errors,
}: PatientFormFieldsProps) {
    return (
        <FieldGroup>
            <div className="grid grid-cols-2 gap-5">
                <Field aria-invalid={!!errors.full_name}>
                    <FieldLabel htmlFor="full_name">
                        שם מלא
                        <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input
                        id="full_name"
                        value={data.full_name}
                        onChange={(event) =>
                            setData("full_name", event.target.value)
                        }
                        aria-invalid={!!errors.full_name}
                        aria-required={true}
                        required
                    />
                    {errors.full_name && (
                        <FieldError>{errors.full_name}</FieldError>
                    )}
                </Field>

                <Field aria-invalid={!!errors.id_number}>
                    <FieldLabel htmlFor="id_number">
                        מספר תעודת זהות
                        <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input
                        id="id_number"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={9}
                        value={data.id_number ?? ""}
                        onChange={(event) =>
                            setData(
                                "id_number",
                                digitsOnly(event.target.value).slice(0, 9),
                            )
                        }
                        aria-invalid={!!errors.id_number}
                        aria-required={true}
                        required
                    />
                    {errors.id_number && (
                        <FieldError>{errors.id_number}</FieldError>
                    )}
                </Field>
            </div>

            <div className="grid grid-cols-2 gap-5">
                <Field aria-invalid={!!errors.address}>
                    <FieldLabel htmlFor="address">
                        כתובת
                        <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input
                        id="address"
                        value={data.address}
                        onChange={(event) =>
                            setData("address", event.target.value)
                        }
                        aria-invalid={!!errors.address}
                        aria-required={true}
                        required
                    />
                    {errors.address && (
                        <FieldError>{errors.address}</FieldError>
                    )}
                </Field>

                <Field aria-invalid={!!errors.phone}>
                    <FieldLabel htmlFor="phone">
                        טלפון
                        <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input
                        id="phone"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={20}
                        value={data.phone}
                        onChange={(event) =>
                            setData(
                                "phone",
                                digitsOnly(event.target.value).slice(0, 20),
                            )
                        }
                        aria-invalid={!!errors.phone}
                        aria-required={true}
                        required
                    />
                    {errors.phone && <FieldError>{errors.phone}</FieldError>}
                </Field>
            </div>

            <div className="grid grid-cols-5 gap-5">
                <Field aria-invalid={!!errors.feeding_type}>
                    <FieldLabel htmlFor="feeding_type">
                        סוג הזנה
                        <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Select
                        value={data.feeding_type}
                        onValueChange={(value) =>
                            setData("feeding_type", value as FeedingType)
                        }
                        aria-invalid={!!errors.feeding_type}
                        aria-required={true}
                        required
                    >
                        <SelectTrigger id="feeding_type" className="w-full">
                            <SelectValue placeholder="סוג הזנה" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {feedingTypes.map((type) => (
                                    <SelectItem key={type} value={type}>
                                        {type}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    {errors.feeding_type && (
                        <FieldError>{errors.feeding_type}</FieldError>
                    )}
                </Field>

                <Field
                    className="col-span-2"
                    aria-invalid={!!errors.last_visit_date}
                >
                    <FieldLabel htmlFor="last_visit_date">
                        תאריך ביקור אחרון
                        <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Popover>
                        <PopoverTrigger className="w-full" asChild>
                            <Button
                                variant="outline"
                                id="last_visit_date"
                                aria-required={true}
                                className="justify-start font-normal"
                                aria-invalid={!!errors.last_visit_date}
                            >
                                {data.last_visit_date ? (
                                    format(data.last_visit_date, "PPP", {
                                        locale: he,
                                    })
                                ) : (
                                    <span>בחר תאריך</span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={new Date(data.last_visit_date)}
                                onSelect={(date) => {
                                    if (date) {
                                        setData(
                                            "last_visit_date",
                                            format(date, "yyyy-MM-dd"),
                                        );
                                    }
                                }}
                                locale={he}
                                required
                            />
                        </PopoverContent>
                    </Popover>
                    {errors.last_visit_date && (
                        <FieldError>{errors.last_visit_date}</FieldError>
                    )}
                </Field>

                <Field
                    className="col-span-2"
                    aria-invalid={!!errors.followup_frequency}
                >
                    <FieldLabel htmlFor="followup_frequency">
                        תדירות מעקב
                        <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Select
                        value={data.followup_frequency}
                        onValueChange={(value) =>
                            setData(
                                "followup_frequency",
                                value as FollowUpFrequency,
                            )
                        }
                        aria-invalid={!!errors.followup_frequency}
                        aria-required={true}
                        required
                    >
                        <SelectTrigger
                            id="followup_frequency"
                            className="w-full"
                        >
                            <SelectValue placeholder="תדירות מעקב" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {FOLLOWUP_FREQUENCY_OPTIONS.map((frequency) => (
                                    <SelectItem
                                        key={frequency.value}
                                        value={frequency.value}
                                    >
                                        {frequency.label}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    {errors.followup_frequency && (
                        <FieldError>{errors.followup_frequency}</FieldError>
                    )}
                </Field>
            </div>
            <Field className="md:col-span-2">
                <FieldLabel htmlFor="notes">הערות</FieldLabel>
                <Textarea
                    id="notes"
                    rows={3}
                    value={data.notes ?? ""}
                    onChange={(event) => setData("notes", event.target.value)}
                />
                {errors.notes && <FieldError>{errors.notes}</FieldError>}
            </Field>
        </FieldGroup>
    );
}
