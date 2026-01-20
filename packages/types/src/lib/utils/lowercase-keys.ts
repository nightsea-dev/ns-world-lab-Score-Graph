type LowercaseKeys<T extends object> = {
    [K in keyof T as Lowercase<K & string>]: T[K]
}

export const lowercaseKeys = <T extends object>(
    obj: T
): LowercaseKeys<T> => {
    return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => [
            key.toLowerCase(),
            value,
        ])
    ) as LowercaseKeys<T>
}
