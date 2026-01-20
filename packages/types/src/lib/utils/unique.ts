



export const unique = <
    T extends any = unknown
>(
    collection: Iterable<T>
) => [...new Set(collection)] as T[]