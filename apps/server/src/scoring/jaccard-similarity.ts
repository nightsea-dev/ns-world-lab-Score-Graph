import { deDupStrings, isUnitInterval, StringRelationshipWithScore } from "@ns-sg/types";

export const isJaccardScore = isUnitInterval
    , isJaccardSimilarity = isUnitInterval
    , isJaccardThreshold = isUnitInterval

const _tokenize = (s: string): string[] => {
    return s
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, " ")
        .split(/\s+/)
        .map((t) => t.trim())
        .filter(Boolean);
}
    , VERBOSE = Boolean(process.env.JACCARD_SIMILARITY_VERBOSE)
// ========================================
/**
 * ---
 * Jaccard similarity on token sets: |A∩B| / |A∪B|
 * ---
 * * Returns [0..1]
 * * [scoreStringRelationship]
 */
export const jaccardSimilarity = (
    a: string
    , b: string
): number => {
    const A = new Set(_tokenize(a))
        , B = new Set(_tokenize(b))
    if (A.size === 0 || B.size === 0) {
        return 0;
    }

    let inter = 0;
    for (const t of A) {
        if (B.has(t)) {
            inter++;
        }
    }
    const union = A.size + B.size - inter;
    return union === 0 ? 0 : inter / union;
}


// ========================================
export type ScoreStringRelationshipsProps =
    & {
        /**
         * * Range [0..1]
         */
        minScore?: number
        strings: Iterable<string>
    }

// ========================================
export type ScoreStringRelationshipsReturnType =
    | {
        scoredRelationships: StringRelationshipWithScore[]
        error?: never
    }
    | {
        scoredRelationships?: never
        error: Error
    }

// ========================================
// ========================================
export const scoreStringRelationships = ({
    minScore
    , strings: strings_IN
}: ScoreStringRelationshipsProps
): ScoreStringRelationshipsReturnType => {

    const { nonDups: strArr } = deDupStrings(strings_IN)

    if (!strArr.length) {
        return {
            error: new Error("[strings] are required.")
        }
    }

    const scoredRelationships = [] as StringRelationshipWithScore[]

    for (let i = 0; i < strArr.length; i++) {
        for (let j = i + 1; j < strArr.length; j++) {

            const a = strArr[i]
                , b = strArr[j]
                , score = jaccardSimilarity(a, b)

            if (VERBOSE) {
                console.log("scoreStringRelationships", {
                    a
                    , b
                    , score
                })
            }

            if (isJaccardThreshold(minScore) && score < minScore) {
                continue
            }

            scoredRelationships.push(...[
                {
                    source: a
                    , target: b
                    , score
                } as StringRelationshipWithScore
                , {
                    source: b
                    , target: a
                    , score
                } as StringRelationshipWithScore
            ])

        }
    }

    return { scoredRelationships }

}