


export type HasCategory<
    TCategory extends any = any
> = {
    category: TCategory
}

export type HasPartialCategory<
    TCategory extends any = any
> = Partial<HasCategory<TCategory>>