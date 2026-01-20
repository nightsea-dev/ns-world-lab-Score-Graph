
export type HasEdge<
    N extends object
    , Sx extends string = ""
> = {
        [k in `edge${Sx}`]: N
    }

export type HasEdges<
    N extends object
> = HasEdge<N[], "s">
