import { ID } from "../primitives/index.js"

export type HasId<
    TId extends ID = ID
> = {
    id: TId
}


export type HasPartialId<
    TId extends ID = ID
> = Partial<HasId<TId>>