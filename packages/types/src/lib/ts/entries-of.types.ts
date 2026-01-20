
export type EntryOf<T extends object>
    = {
        [k in Extract<keyof T, string>]: [k: k, b: T[k]]
    }[Extract<keyof T, string>]
