import { KeyOf } from "./key-of.types.js";




export type CapitaliseKeys<
    T extends object
> = {
        [k in KeyOf<T> as Capitalize<k>]: T[k]
    }


