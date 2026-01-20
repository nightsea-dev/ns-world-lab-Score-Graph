import { KeyOf } from "./key-of.types.js";

// export type KeysWithValue<
//     T extends Record<string, any>
//     , V extends any
// > = {
//     [k in KeyOf<T>]: T[k] extends V ? k : never
// }[KeyOf<T>]


export type KeysWithValue<
    T extends Record<string, any>
    , V extends any
> = Extract<KeyOf<T>, V>
export type OmitKeysWithValue<
    T extends Record<string, any>
    , V extends any
> = Exclude<KeyOf<T>, V>