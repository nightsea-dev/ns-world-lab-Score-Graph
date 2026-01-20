
export type HasItem<
    TItem extends any = any
    , Sx extends string = ""
> = {
        [k in `item${Sx}`]: TItem
    }
export type HasItems<
    TItem extends any = any
> = HasItem<TItem[], "s">

export type HasItemsArray<
    TItemsArray extends any[] | (readonly any[])
> = HasItem<TItemsArray, "s">

export type HasPartialItem<
    TItem extends any = any
> = Partial<HasItem<TItem>>

export type HasPartialItems<
    TItem extends any = any
> = Partial<HasItems<TItem>>

