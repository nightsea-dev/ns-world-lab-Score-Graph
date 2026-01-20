
export type HasNode<
    N extends object
    , Sx extends string = ""
> = {
        [k in `node${Sx}`]: N
    }

export type HasNodes<
    N extends object
> = HasNode<N[], "s">
