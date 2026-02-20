import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/** Strip non-digits from a string (for id_number, phone, etc.). */
export function digitsOnly(value: string): string {
    return value.replace(/\D/g, "");
}
