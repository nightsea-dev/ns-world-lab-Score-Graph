import {
    CapitaliseKeys
    , KeyOf
} from "../../ts/index.js"


// ========================================
// transformations
export type PrefixedString<
    Px extends string
    , T extends string = string
> = `${Px}${T}`

export type SuffixedString<
    Sx extends string
    , T extends string = string
> = `${T}${Sx}`

export type PrefixedAndSuffixed<
    Px extends string
    , Sx extends string
    , T extends string = string
> =
    & PrefixedString<Px, SuffixedString<Sx, T>>



// ========================================
// compose+transform - prefix
export type PrefixKeys<
    Px extends string
    , T extends object = object
> = {
        [k in KeyOf<T> as PrefixedString<Px, k>]: T[k]
    }

export type PickPrefixedKeys<
    Px extends string
    , T extends object
    , PK extends KeyOf<T>
> = PrefixKeys<Px, Pick<T, PK>>

export type PrefixKeysAndCapitalisedAfter<
    Px extends string
    , T extends object = object
> = PrefixKeys<Px, CapitaliseKeys<T>>

/**
 * * PrefixKeysAndCapitalisedAfter
 */
export type PAC<
    Px extends string
    , T extends object = object
> = PrefixKeysAndCapitalisedAfter<Px, T>



// ========================================
// compose+transform - suffix
export type SuffixedKey<
    Sx extends string
    , T extends object
> = {
        [k in KeyOf<T> as SuffixedString<Sx, k>]: T[k]
    }

export type PickSuffixedKeys<
    Sx extends string
    , T extends object
    , PK extends KeyOf<T>
> = SuffixedKey<Sx, Pick<T, PK>>





// ========================================
export type ExtractPrefixedKeysLike<
    Px extends string
    , T extends object
> = Extract<KeyOf<T>, PrefixedString<Px>>

export type ExtractSuffixedKeysLike<
    Sx extends string
    , T extends object
> = Extract<KeyOf<T>, SuffixedString<Sx>>


export type PickPrefixedKeysLike<
    Px extends string
    , T extends object = object
> = {
        [k in ExtractPrefixedKeysLike<Px, T>]: T[k]
    }

export type PickSuffixedKeysLike<
    Sx extends string
    , T extends object = object
> = {
        [k in ExtractSuffixedKeysLike<Sx, T>]: T[k]
    }


