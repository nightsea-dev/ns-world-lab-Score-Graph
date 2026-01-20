import { KeyOf } from "./key-of.types.js";


export type KeysWithObjectValuesWithProperties<
    T extends Record<string, object>
> = {
    [k in KeyOf<T>]:
    T[k] extends object
    ? (
        KeyOf<T[k]> extends never
        ? never
        : k
    )
    : never
}[KeyOf<T>]


export type KeysWithObjectValuesWithoutProperties<
    T extends Record<string, object>
> = Exclude<
    KeyOf<T>
    , KeysWithObjectValuesWithProperties<T>
>