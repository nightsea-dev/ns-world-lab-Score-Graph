import { HasEdges, HasNodes } from "../../capabilities/index.js"

export type GraphDataBase<
    N extends object
    , E extends object
> =
    & HasNodes<N>
    & HasEdges<E>


