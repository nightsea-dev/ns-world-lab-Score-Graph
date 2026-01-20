import { KeyOf } from "../ts/index.js"


export type AnyKind = string

export type HasKind<
    K extends AnyKind = AnyKind
> = {
    kind: K
}

export type HasPartialKind<
    K extends AnyKind = AnyKind
> = Partial<HasKind<K>>


export type ValuesHavePropertyAsKind<
    T extends Record<string, object>
> = {
        [k in KeyOf<T>]: T[k] & HasKind<k>
    }




export type OmitKind<
    T extends object
> = Omit<T, KeyOf<HasKind>>
