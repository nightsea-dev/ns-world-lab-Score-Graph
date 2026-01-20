


export type EventOf<
    T extends ((...args: any) => any)
> = Parameters<NonNullable<T>>[0]

// ========================================

