

export type HasSelected<
    T extends any = unknown
    , Sx extends string = ""
> = {
        [k in `selected${Sx}`]: T
    }

export type HasPartialSelected<
    T extends any = unknown
    , Sx extends string = ""
> = Partial<HasSelected<T, Sx>>

