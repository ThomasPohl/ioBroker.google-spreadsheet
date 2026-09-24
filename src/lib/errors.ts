export function wrapGoogleError(operation: string, error: any): Error {
    const message = error && typeof error === 'object' && 'message' in error ? String(error.message) : String(error ?? 'Unknown error');
    return new Error(`${operation}: ${message}`);
}

export function ensureRequired<T>(value: T | undefined | null, label: string): T {
    if (value === undefined || value === null || value === '') {
        throw new Error(`Missing parameters for ${label}`);
    }
    return value;
}
