/**
 * Google Calendar API event color palette (colorId 1–11).
 * Used for the schedule-visit dialog so users can pick an event color.
 * @see https://developers.google.com/workspace/calendar/api/v3/reference/colors
 */
export const CALENDAR_EVENT_COLORS = [
    { id: 9, background: "#5484ed", label: "כחול" },
    { id: 1, background: "#a4bdfc", label: "סגול כהה" },
    { id: 2, background: "#7ae7bf", label: "ירוק" },
    { id: 3, background: "#dbadff", label: "סגול" },
    { id: 4, background: "#ff887c", label: "אדום־ורוד" },
    { id: 5, background: "#fbd75b", label: "צהוב" },
    { id: 6, background: "#ffb878", label: "כתום" },
    { id: 7, background: "#46d6db", label: "תכלת" },
    { id: 8, background: "#e1e1e1", label: "אפור" },
    { id: 10, background: "#51b749", label: "ירוק כהה" },
    { id: 11, background: "#dc2127", label: "אדום" },
] as const;

export type CalendarEventColorId = (typeof CALENDAR_EVENT_COLORS)[number]["id"];
