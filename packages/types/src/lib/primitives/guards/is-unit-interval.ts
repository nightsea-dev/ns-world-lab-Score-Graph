import { isNumber } from "./is-native-value.js"


/**
 * * inclusive [min, max]
 */
export const isWithinRange = (v: unknown, [min, max]: [number, number]): v is number =>
    isNumber(v)
    && (v >= min && v <= max)


    , isUnitInterval = (
        v: unknown
    ): v is number => isWithinRange(v, [0, 1])
    , isNormalisedScore = isUnitInterval
    , isProbabilityLike = isUnitInterval
    , isUnitRange = isUnitInterval
    , isConfidenceScore = isUnitInterval
    , isNormalisedScalar = isUnitInterval




    , clampToUnitInterval = (n: number) => Math.max(0, Math.min(1, n))