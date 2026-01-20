


export type HasValue<
    V extends any = any
> = {
    value: V
}

export type HasPartialValue<
    V extends any = any
> = Partial<HasValue<V>>