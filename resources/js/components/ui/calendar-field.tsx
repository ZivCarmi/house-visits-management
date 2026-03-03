import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { he } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import type { DayPickerProps } from "react-day-picker";

interface CalendarFieldProps extends Omit<
    DayPickerProps,
    "mode" | "selected" | "onSelect"
> {
    id?: string;
    date: Date | undefined;
    onSelect: (date: Date | undefined) => void;
    placeholder?: string;
}

export function CalendarField({
    id,
    date,
    onSelect,
    placeholder = "בחר תאריך",
    ...calendarProps
}: CalendarFieldProps) {
    const [open, setOpen] = useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    id={id}
                    variant="outline"
                    aria-required={calendarProps.required}
                    className="justify-start font-normal"
                >
                    <CalendarIcon className="me-2" />
                    {date ? (
                        format(date, "PPP", {
                            locale: he,
                        })
                    ) : (
                        <span>{placeholder}</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => {
                        onSelect(date);
                        setOpen(false);
                    }}
                    locale={he}
                    {...calendarProps}
                />
            </PopoverContent>
        </Popover>
    );
}
