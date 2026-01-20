import { KeyOf } from "./key-of.types.js"

export type PartialOrFull<
    T extends object
    , K extends KeyOf<T> = KeyOf<T>
> =
    | {
        [k in K]: T[k]
    }
    | T

export type PartialOrFullFnOf<
    T extends object
> = <
    K extends KeyOf<T> = KeyOf<T>
>(partial: PartialOrFull<T, K>) => void
