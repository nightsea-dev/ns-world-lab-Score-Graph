import { HasId, HasScore } from "../../../../capabilities/index.js"
import { RelationshipWithSuffixedKey } from "../../../../contracts/index.js"
import { ID } from "../../../../primitives/index.js"


/**
 * * HasId
*/
export type Edge<
    TId extends ID = ID
> =
    & RelationshipWithSuffixedKey<"_id", TId>
    & HasId

export type EdgeWithScore<
    TId extends ID = ID
> =
    & Edge<TId>
    & HasScore

/**
 * * without "id"
 */
export type EdgeWithoutIdAndWithScore<
    TId extends ID = ID
> =
    & Omit<Edge<TId>, keyof HasId>
    & HasScore


