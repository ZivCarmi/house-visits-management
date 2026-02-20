export function formatDate(value: string | null | undefined, locale: string = 'he-IL'): string {
    if (!value) {
        return '';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(date);
}

export function isOverdue(value: string | null | undefined): boolean {
    if (!value) {
        return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return false;
    }

    date.setHours(0, 0, 0, 0);

    return date < today;
}

