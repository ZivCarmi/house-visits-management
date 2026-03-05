import { Button } from "@/components/ui/button";
import { CalendarField } from "@/components/ui/calendar-field";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useScheduleVisitForm } from "@/hooks/useScheduleVisitForm";
import { CALENDAR_EVENT_COLORS } from "@/lib/calendarEventColors";
import type { Patient } from "@/types/patient";
import { usePage } from "@inertiajs/react";
import { CalendarIcon, CheckIcon, Clock2Icon } from "lucide-react";

interface ScheduleVisitDialogProps {
    open: boolean;
    onClose: () => void;
    patient: Patient | null;
}

export default function ScheduleVisitDialog({
    open,
    onClose,
    patient,
}: ScheduleVisitDialogProps) {
    const { googleCalendarConnected } = usePage().props as {
        googleCalendarConnected?: boolean;
    };

    const {
        visitDate,
        setVisitDate,
        startTime,
        setStartTime,
        endTime,
        setEndTime,
        notes,
        setNotes,
        colorId,
        setColorId,
        errors,
        processing,
        submit,
    } = useScheduleVisitForm(patient, open, onClose);

    const handleConnect = () => {
        if (patient) {
            window.location.href = `/google-calendar/connect?state=patient_${patient.id}`;
        }
    };

    if (!googleCalendarConnected) {
        return (
            <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>תזמון ביקור ביומן Google</DialogTitle>
                        <DialogDescription>
                            יש לחבר יומן Google כדי לתזמן ביקורים
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">ביטול</Button>
                        </DialogClose>
                        <Button onClick={handleConnect}>
                            <CalendarIcon className="ms-2" />
                            חבר יומן Google
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-lg">
                <form onSubmit={submit} className="space-y-4">
                    <DialogHeader>
                        <DialogTitle>תזמון ביקור ביומן Google</DialogTitle>
                        <DialogDescription>
                            תזמן ביקור בית עבור {patient?.full_name}
                        </DialogDescription>
                    </DialogHeader>
                    <FieldGroup>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Field>
                                <FieldLabel htmlFor="schedule-patient">
                                    מטופל
                                </FieldLabel>
                                <Input
                                    id="schedule-patient"
                                    value={patient?.full_name || ""}
                                    disabled
                                    className="bg-muted"
                                    aria-readonly
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="schedule-address">
                                    כתובת
                                </FieldLabel>
                                <Input
                                    id="schedule-address"
                                    value={patient?.address || ""}
                                    disabled
                                    className="bg-muted"
                                    aria-readonly
                                />
                            </Field>
                        </div>

                        <Field aria-invalid={!!errors.start_datetime}>
                            <FieldLabel htmlFor="visit-date">
                                תאריך ביקור
                                <span className="text-destructive">*</span>
                            </FieldLabel>

                            <CalendarField
                                id="visit-date"
                                date={visitDate}
                                onSelect={setVisitDate}
                                hidden={{ before: new Date() }}
                                startMonth={new Date()}
                                required
                            />
                            {errors.start_datetime && (
                                <FieldError>{errors.start_datetime}</FieldError>
                            )}
                        </Field>

                        <div className="grid grid-cols-2 gap-5">
                            <Field aria-invalid={!!errors.start_datetime}>
                                <FieldLabel htmlFor="start-time">
                                    שעת התחלה
                                    <span className="text-destructive">*</span>
                                </FieldLabel>
                                <InputGroup>
                                    <InputGroupInput
                                        id="start-time"
                                        type="time"
                                        value={startTime}
                                        onChange={(e) =>
                                            setStartTime(e.target.value)
                                        }
                                        className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                                        aria-required
                                        aria-invalid={!!errors.start_datetime}
                                        required
                                    />
                                    <InputGroupAddon>
                                        <Clock2Icon className="text-muted-foreground" />
                                    </InputGroupAddon>
                                </InputGroup>
                            </Field>

                            <Field aria-invalid={!!errors.end_datetime}>
                                <FieldLabel htmlFor="end-time">
                                    שעת סיום
                                    <span className="text-destructive">*</span>
                                </FieldLabel>
                                <InputGroup>
                                    <InputGroupInput
                                        id="end-time"
                                        type="time"
                                        value={endTime}
                                        onChange={(e) =>
                                            setEndTime(e.target.value)
                                        }
                                        className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                                        aria-required
                                        aria-invalid={!!errors.end_datetime}
                                        required
                                    />
                                    <InputGroupAddon>
                                        <Clock2Icon className="text-muted-foreground" />
                                    </InputGroupAddon>
                                </InputGroup>
                                {errors.end_datetime && (
                                    <FieldError>
                                        {errors.end_datetime}
                                    </FieldError>
                                )}
                            </Field>
                        </div>

                        <Field>
                            <FieldLabel>צבע</FieldLabel>
                            <div className="flex flex-wrap gap-2" role="group" aria-label="בחירת צבע לאירוע">
                                {CALENDAR_EVENT_COLORS.map(({ id, background }) => (
                                    <button
                                        key={id}
                                        type="button"
                                        onClick={() => setColorId(id)}
                                        className={`flex size-8 items-center justify-center rounded-full border-2 transition-[border-color,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${colorId === id
                                            ? "border-primary ring-2 ring-primary/20"
                                            : "border-transparent hover:opacity-90"
                                            }`}
                                        style={{ backgroundColor: background }}
                                        title={CALENDAR_EVENT_COLORS.find((c) => c.id === id)?.label}
                                        aria-pressed={colorId === id}
                                    >
                                        {colorId === id && (
                                            <CheckIcon className="size-4 text-white drop-shadow-[0_0_1px_rgba(0,0,0,0.8)]" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </Field>

                        <Field aria-invalid={!!errors.notes}>
                            <FieldLabel htmlFor="notes">
                                הערות (אופציונלי)
                            </FieldLabel>
                            <Textarea
                                id="notes"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="הוסף הערות לביקור..."
                                maxLength={500}
                                rows={3}
                                aria-invalid={!!errors.notes}
                            />
                            <p className="text-xs text-muted-foreground">
                                {notes.length}/500 תווים
                            </p>
                            {errors.notes && (
                                <FieldError>{errors.notes}</FieldError>
                            )}
                        </Field>
                    </FieldGroup>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" disabled={processing}>
                                ביטול
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={processing}>
                            {processing && <Spinner data-icon="inline-start" />}
                            הוסף ליומן
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
