export function preferValue<T>(primary: T | undefined | null, fallback: T | undefined | null): T | undefined | null {
    return primary !== undefined && primary !== null ? primary : fallback;
}

export function normalizeCellReference(cell: string): string {
    if (cell.startsWith("'") && cell.endsWith("'")) {
        return cell.substring(1, cell.length - 1);
    }
    return cell;
}

export function isValidCellPattern(cell: string): boolean {
    return /^[A-Z]+[0-9]+$/i.test(cell);
}

export function normalizeLegacyMessage<T extends Record<string, any>>(messageData: T): T & {
    sheet?: string;
    range?: string;
    value?: any;
    values?: any;
} {
    const normalized = { ...messageData } as T & {
        sheet?: string;
        range?: string;
        value?: any;
        values?: any;
    };
    if (!normalized.sheet && normalized.sheetName) {
        normalized.sheet = normalized.sheetName;
    }
    if (!normalized.range && normalized.cellRange) {
        normalized.range = normalized.cellRange;
    }
    if (typeof normalized.value === 'undefined' && typeof normalized.data !== 'undefined') {
        normalized.value = normalized.data;
    }
    if (typeof normalized.values === 'undefined' && typeof normalized.data !== 'undefined') {
        normalized.values = normalized.data;
    }
    return normalized;
}
