


export type HasData<
    V extends any = unknown
> = { data: V }

export type HasPartialData<
    V extends any = unknown
> = Partial<HasData<V>>



