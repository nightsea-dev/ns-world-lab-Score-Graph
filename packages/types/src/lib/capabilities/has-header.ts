


export type HasHeader<
    V extends any = unknown
> = {
    header: V
}

export type HasPartialHeader<
    V extends any = unknown
> = Partial<HasHeader<V>>