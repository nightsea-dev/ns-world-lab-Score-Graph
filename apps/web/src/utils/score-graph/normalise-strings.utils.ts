import { isString } from "@ns-sg/types"

export type StringValue = string | undefined | null
export type NormaliseStringsInput = StringValue | StringValue[]

/**
 * * normalised
 * * unique, sorted, lowered
 */
export const normaliseStringsFn
    = (
        input: NormaliseStringsInput
    ) => {

        const arr = Array.isArray(input)
            ? input : [input]

            , parts = arr
                .filter(isString)
                .flatMap((v) => v
                    .toLowerCase()
                    .trim()
                    .split(/(?:,|\r?\n)+/g)
                    .map((s) => s.trim())
                    .filter(Boolean)
                )

            , unique = [...new Set(parts)]

        unique.sort((a, b) => a.localeCompare(b))

        return unique
    }

    , haveSameStringValuesFn = (
        a: StringValue[] = []
        , b: StringValue[] = []
    ) => {

        const [arrA, arrB]
            = [a, b].map(normaliseStringsFn)

            , haveSameValues
                = arrA.length === arrB.length
                && arrA.every((v, i) => v === arrB[i])

        return {
            arrA
            , arrB
            , haveSameValues
        }
    }
