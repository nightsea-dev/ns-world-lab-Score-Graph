import { KeyOf } from "./key-of.types.js";

export type ValueOf<
    T extends object
    , K extends KeyOf<T> = KeyOf<T>
> = T[K]

