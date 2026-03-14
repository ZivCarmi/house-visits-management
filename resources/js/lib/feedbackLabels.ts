export const FEEDBACK_TYPE_OPTIONS = [
    { value: "feature_idea", label: "רעיון לפיצ׳ר" },
    { value: "bug", label: "באג" },
    { value: "unclear", label: "משהו לא ברור" },
    { value: "other", label: "אחר" },
] as const;

export const FEEDBACK_TYPE_DESCRIPTIONS: Record<string, string> = {
    feature_idea: "תאר את הרעיון בפירוט — מה תרצה שהמערכת תכלול?",
    bug: "פרט מה קרה, מה ציפית שיקרה, ובאיזה שלב הבאג מופיע",
    unclear: "ספר מה לא היה ברור ואיפה במערכת",
    other: "כל מידע נוסף שתרצה לשתף",
};
