import { PrimitiveValue } from "./primitive-value.js"
import { UnionToIntersection } from "./union-to-intersection.js"

export type FlattenKeys<
    T,
    Prefix extends string = ""
> = {
    [K in keyof T]:
    T[K] extends PrimitiveValue
    ? {
        [P in `${Prefix}${K & string}`]: T[K]
    }
    : T[K] extends Record<string, any>
    ? FlattenKeys<
        T[K],
        `${Prefix}${K & string}.`
    >
    : {
        [P in `${Prefix}${K & string}`]: T[K]
    }
}[keyof T]




export type Flattened<T> = UnionToIntersection<FlattenKeys<T>>

