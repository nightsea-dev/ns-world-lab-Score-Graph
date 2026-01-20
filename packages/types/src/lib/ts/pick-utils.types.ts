


export type PickRestPartial<
    T extends object
    , K extends keyof T
> =
    & Pick<T, K>
    & Partial<Omit<T, K>>


export type PickRequiredRestPartial<
    T extends object
    , K extends keyof T
> =
    & Required<Pick<T, K>>
    & Partial<Omit<T, K>>